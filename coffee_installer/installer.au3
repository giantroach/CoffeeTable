#include <Constants.au3>
#include <ButtonConstants.au3>
#include <EditConstants.au3>
#include <GUIConstantsEx.au3>
#include <ProgressConstants.au3>
#include <StaticConstants.au3>
#include <WindowsConstants.au3>

#include <File.au3>

#Region ### START Koda GUI section ### Form=
$Form1_1 = GUICreate("Coffee Table Installer", 621, 342, 254, 124)
GUISetFont(9, 400, 0, "Arial")
$Group1 = GUICtrlCreateGroup("Target", 16, 8, 585, 145)
$tex_url = GUICtrlCreateInput("localhost", 128, 24, 465, 20)
$Label1 = GUICtrlCreateLabel("URL", 24, 24, 98, 16)
$Label2 = GUICtrlCreateLabel("Port", 24, 48, 97, 16)
$tex_port = GUICtrlCreateInput("5984", 128, 48, 121, 20)
$tex_db = GUICtrlCreateInput("coffee", 128, 72, 121, 20)
$Label5 = GUICtrlCreateLabel("DB", 24, 72, 103, 16)
$Label3 = GUICtrlCreateLabel("User", 24, 96, 100, 16)
$tex_user = GUICtrlCreateInput("", 128, 96, 121, 20)
$tex_password = GUICtrlCreateInput("", 128, 120, 121, 20, BitOR($GUI_SS_DEFAULT_INPUT,$ES_PASSWORD))
$Label4 = GUICtrlCreateLabel("Password", 24, 120, 101, 16)
GUICtrlCreateGroup("", -99, -99, 1, 1)
$btn_setup = GUICtrlCreateButton("Setup", 392, 304, 129, 25, $BS_DEFPUSHBUTTON)
$btn_cancel = GUICtrlCreateButton("Cancel", 528, 304, 75, 25)
$edi_log = GUICtrlCreateEdit("", 16, 168, 585, 89, BitOR($GUI_SS_DEFAULT_EDIT,$ES_READONLY))
GUICtrlSetData(-1, "")
$pro_progress = GUICtrlCreateProgress(16, 272, 590, 17)
GUISetState(@SW_SHOW)
#EndRegion ### END Koda GUI section ###

While 1
	$nMsg = GUIGetMsg()
	Switch $nMsg
        Case $btn_setup
            setup()

        Case $btn_cancel
            Exit

		Case $GUI_EVENT_CLOSE
			Exit

	EndSwitch
WEnd


Func setup()
    Local $stdout
    Local $params
    Local $pid

    Local $log = GUICtrlRead($edi_log)

    Local $url = GUICtrlRead($tex_url)
    Local $port = GUICtrlRead($tex_port)
    Local $user = GUICtrlRead($tex_user)
    Local $password = GUICtrlRead($tex_password)
    Local $db = GUICtrlRead($tex_db)

    ; create db
    readStdOut(curl(buildCurlParam($url, $port, $db, "", $user, $password, "PUT", "", "", "")))

    ; setup documents according to the ini file
    readDef($url, $port, $user, $password, $db)
EndFunc





;
; Readline
;
Func readDef($url, $port, $user, $password, $db)
    Local $numOfLine = _FileCountLines("def.ini")
    If @error = 1 Then
        MsgBox(0, "error", "def.ini is not found or cannot be read!!")
        Return
    EndIf

    Local $fh = FileOpen("def.ini", 0)

    Local $line
    Local $doc
    Local $field
    Local $data
    Local $file

    Local $stdout
    Local $rev

    Local $curLine = 0

    While 1
        $line = FileReadLine($fh)
        If @error = -1 Then ExitLoop

        If StringRegExp($line, "^\[") Then
            ; section (document) is found
            $doc = StringRegExpReplace($line, "^\[([^\]]+)\]$", "\1")
            GUICtrlSetData($edi_log, @CRLF & "-------- " & $doc & " --------" & @CRLF, True)
            $rev = ""

        ElseIf StringRegExp($line, "^[^=]+=.+") Then
            ; data is found
            $field = StringRegExpReplace($line, "^([^=]+)=.+$", "\1")
            $data = StringRegExpReplace($line, "^[^=]+=(.+)$", "\1")

            if Not($rev) Then
                $rev = findRev(readStdOut(curl(buildCurlParam($url, $port, $db, $doc, $user, $password, "GET", "", "", ""))))
                if (StringInStr($rev, '{"error":')) Then
                    $rev = ""
                EndIf
            EndIf

            $rev = findRev(readStdOut(curl(buildCurlParam($url, $port, $db, $doc, $user, $password, "PUT", makeJsonString('{"' & $field & '":' & $data & '}'), "", $rev))))
            Sleep(100)

        ElseIf StringRegExp($line, "^@.+\.json$") Then
            ; json file is found
            $rev = findRev(readStdOut(curl(buildCurlParam($url, $port, $db, $doc, $user, $password, "PUT", $line, "", ""))))
            Sleep(100)

        ElseIf StringRegExp($line, "^.+\.[a-zA-Z\d]{2,4}$") Then
            ; file is found
            if Not($rev) Then
                $rev = findRev(readStdOut(curl(buildCurlParam($url, $port, $db, $doc, $user, $password, "GET", "", "", ""))))
                if (StringInStr($rev, '{"error":')) Then
                    $rev = ""
                EndIf
            EndIf

            $rev = findRev(readStdOut(curl(buildCurlParam($url, $port, $db, $doc, $user, $password, "PUT", "", $line, $rev))))
            Sleep(100)

        EndIf

        GUICtrlSetData($pro_progress, $curLine / $numOfLine * 100)
        $curLine = $curLine + 1
    WEnd

    FileClose($fh)
    GUICtrlSetData($pro_progress, 100)
    GUICtrlSetData($edi_log, @CRLF & "-------- Setup Completed --------" & @CRLF, True)
EndFunc


;
; @method makeJsonString
; @param {String} str
; @return {String}
;
Func makeJsonString($str)
    Local $formatted = ""

    $formatted = $formatted & '"'
    $formatted = $formatted & StringReplace($str, '"', '\"')
    $formatted = $formatted & '"'

    Return $formatted
EndFunc


;
; Build curl param string
; @method buildCurlParam
; @param {String} $url
; @param {String} $port
; @param {String} $db
; @param {String} $document
; @param {String} $user
; @param {String} $password
; @param {String} $method
; @param {String} $data JSON data (optional)
; @param {String} $file File path (optional)
; @param {String} $rev Revision number (optional)
; @return {String}
;
Func buildCurlParam($url, $port, $db, $document, $user, $password, $method, $data, $file, $rev)
    Local $param = ""

    ; Method
    if ($method) Then
        $param = $param & " -X " & $method
    EndIf

    ; Data
    if ($data) Then
        If ($rev) Then
            $data = StringRegExpReplace($data, "^(\{)(.*)$", ('\1"_rev":"' & $rev & '",\2'))
        EndIf
        $param = $param & " -d " & $data
    EndIf

    ; URL
    $param = $param & " ""http://"
    if ($user And $password) Then
        $param = $param & $user & ":" & $password & "@"
    EndIf
    $param = $param & $url & ":" & $port & "/" & $db & "/" & $document

    ; File (combined with URL)
    if ($file) Then
        Local $filename = StringRegExpReplace($file, "^.*/([^/]+)$", "\1")

        $param = $param & "/" & $filename
        If $rev Then
            $param = $param & "?rev=" & $rev
        EndIf
        $param = $param & '"'

        If StringRegExp($filename, "\.html?$") Then
            ;$param = $param & '" -H "Content-Type:text/html; charset=UTF-8" @' & $file
            $param = $param & ' -H "Content-Type:text/html;"'

        ElseIf StringRegExp($filename, "\.js$") Then
            $param = $param & ' -H "Content-Type:application/x-javascript;"'

        ElseIf StringRegExp($filename, "\.css") Then
            $param = $param & ' -H "Content-Type:text/css;"'

        ElseIf StringRegExp($filename, "\.png") Then
            $param = $param & ' -H "Content-Type:image/png;"'

        ElseIf StringRegExp($filename, "\.jpg") Then
            $param = $param & ' -H "Content-Type:image/jpeg;"'

        ElseIf StringRegExp($filename, "\.gif") Then
            $param = $param & ' -H "Content-Type:image/gif;"'

        EndIf

        $param = $param & ' --data-binary @' & $file

        ;$param = $param & '" @' & $file
        ;$param = $param & "/" & $filename & "?rev=" & $rev & '" --data-binary @' & $file

    Else
        $param = $param & '"'

    EndIf

    Return $param
EndFunc


;
; execute curl with given param and returns the stdout
; @method curl
; @param {String} $opts
; @return {String}
;
Func curl($opts)
    Local $pid = Run("curl.exe " & $opts, @ScriptDir, @SW_HIDE, $STDERR_CHILD + $STDOUT_CHILD)

    GUICtrlSetData($edi_log, "curl.exe " & $opts & @CRLF, True)

    Return $pid
EndFunc


;
; by calling just after curl, this method let you read up the std/err out
; @method readStdOut
; @return {String}
;
Func readStdOut($pid)
    Local $line = ""
    Local $output = ""

    ; stdout
    While 1
        $line = StdoutRead($pid)
        If @error Then ExitLoop
        if StringRegExp($line, "^\{") Then
            $output = $output & $line
        EndIf
    WEnd

    ; stderr
    While 1
        $line = StderrRead($pid)
        If @error Then ExitLoop
        if StringRegExp($line, "^\{") Then
            $output = $output & $line
        EndIf
    Wend

    GUICtrlSetData($edi_log, $output & @CRLF, True)
    Return $output
EndFunc


;
; @method findRev
; @param {String} $stdout
; @return {String}
;
Func findRev($stdout)
    Return StringRegExpReplace($stdout, '.+"_?rev":"([^"]+)".+', "\1")
EndFunc


; Shows the filenames of all files in the current directory.
Local $search = FileFindFirstFile("*.*")

; Check if the search was successful
If $search = -1 Then
    MsgBox(0, "Error", "No files/directories matched the search pattern")
    Exit
EndIf

While 1
    Local $file = FileFindNextFile($search)
    If @error Then ExitLoop

    MsgBox(4096, "File:", $file)
WEnd

; Close the search handle
FileClose($search)