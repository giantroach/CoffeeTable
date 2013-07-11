/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

coffee.include("Login", "login.html", ["Component"], function (name, ext) {
    "use strict";

    var $ = ext.$,
        Backbone = ext.Backbone,

        m = {},
        c = {},
        r = {},
        v = {};


    /**
     * Model
     */
    m[name] = ext.m.Component.extend({
    });

    // Collection
    c[name] = ext.c.Component.extend({
    });

    // View
    v[name] = ext.v.Component.extend({
        afterRender: function () {
            $("#login_dialog").dialog({
                modal: true,
                closeOnEscape: false,
                resizable: false,
                open: function () {
                    $(".ui-dialog-titlebar-close").hide();
                },
                buttons: {
                    Done: function () {
                        if ($("#usr_name").val()) {
                            //TODO: log this login here
                            $(this).dialog("close");
                        } else {
                            alert("Enter ur fuckin name I said!");
                        }
                    }
                }
            });
        }
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

});
