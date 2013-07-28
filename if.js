// old one
{
   "trace": "function (doc, req) { var key, str = ''; for (key in req.form) { str += (key + ':\"' + req.form[key] + '\"; ') } return [doc, str]; }",
   "insert": "function (doc, req) { var id = req.form.id, data = req.form.data || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[id]) { doc[id] = []; } doc[id].push(data); if (doc[id].length > (doc.maxline || 1000)) { doc[id].splice(0, doc[id].length - (doc.maxline || 1000)); } return [doc, 'insert complete.' + req.form.id]; }",
   "add": "function (doc, req) { var key, offsets = req.form; if (doc.counters) { for (key in offsets) { doc.counters[key] = doc.counters[key] ? (doc.counters[key] + (parseInt(offsets[key], 10))) : (parseInt(offsets[key], 10) || 0); } } return [doc, 'add complete.']; }",
   "piecePos": "function (doc, req) { var i, max, id = req.form.target; if (doc.pos) { for (i = 0, max = doc.pos.length; i < max; i += 1) { if (doc.pos[i].id === id) { doc.pos[i].x = req.form.x; doc.pos[i].y = req.form.y; doc.pos[i].lastRev = doc._rev; return [doc, 'updated']; } } doc.pos.push({ id : id, cls : req.form.cls, x : req.form.x || 0, y : req.form.y || 0, lastRev : doc._rev }); return [doc, 'added']; } }",
   "pieceDel": "function (doc, req) { var i, id = req.form.target; for (i = doc.pos.length - 1; 0 <= i; i -= 1) { if (doc.pos[i].id === id) { doc.pos.splice(i, 1); } } return [doc, 'deleted']; }"
}


// for debug
"function (doc, req) { var key, str = ''; for (key in req.form) { str += (key + ':' + req.form[key] + ';') } return [doc, 'trace : ' + str]; }"


// new one
{
   "trc": "function (doc, req) { var key, str = ''; for (key in req.form) { str += (key + ':\"' + req.form[key] + '\"; ') } return [doc, str]; }",
   "ins": "function (doc, req) { var id = req.form.guid, key = req.form.grp || 'data', data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } if (!doc[key][id]) { doc[key][id] = []; } doc[key][id].push(data); if (doc[key][id].length > (doc.maxline || 1000)) { doc[key][id].splice(0, doc[key][id].length - (doc.maxline || 1000)); } return [doc, 'insert complete : [' + id + ']']; }",
   "add": "function (doc, req) { var itr, id = req.form.guid, key = req.form.grp || 'data', data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } if (doc[key][id]) { for (itr in data) { doc[key][id][itr] = doc[key][id][itr] ? (doc[key][id][itr] + (parseInt(data[itr], 10))) : (parseInt(data[itr], 10) || 0); } } return [doc, 'add complete : [' + id + ']']; }",
   "sav": "function (doc, req) { var id = req.form.guid, key = req.form.grp || 'data', data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } doc[key][id] = data; return [doc, 'update complete : [' + id + ']']; }",
   "del": "function (doc, req) { var id = req.form.guid, key = req.form.grp || 'data'; if (doc[key] && doc[key][id]) { delete doc[key][id]; } return [doc, 'delete complete : [' + id + ']']; }",
   "tra": "function (doc, req) { var key, cnt, splitData, frm = req.form || {}, from = frm.from, to = frm.to, guid = frm.guid, override = {}, idx = parseInt(frm.idx, 10), extend = function (dst, src) { var key; for (key in src) { dst[key] = src[key]; } return dst; }; for (key in frm) { if (key.indexOf('override') >= 0) { splitData = key.split(/[\\[\\]]+/g); if (splitData.length === 4) { if (!override[splitData[1]]) { override[splitData[1]] = {}; } override[splitData[1]][splitData[2]] = frm[key]; } } } if (!doc[from] || !doc[to]) { return [doc, 'transfer failed : [' + from + ' > ' + to + ']']; } if (guid) { doc[to][guid] = extend(doc[from][guid], override); delete doc[from][guid]; return [doc, 'transfer complete : [' + from + ' > ' + to + ' : ' + guid + ']']; } cnt = 0; for (key in doc[from]) { if (cnt === idx || key === guid) { doc[to][key] = extend(doc[from][key], override); delete doc[from][key]; break; } cnt += 1; } return [doc, 'transfer complete : [' + from + ' > ' + to + ']'];}",

    "savAll": "function (doc, req) { var i, max, key, id, splitData, frm = req.form || {}, data = [], grp = frm.grp || 'data', nm = frm.nm || 'anonymous', tm = new Date().toString(); for (key in frm) { splitData = key.split(/[\\[\\]]+/g); if (splitData.length === 4) { if (!data[splitData[1]]) { data[splitData[1]] = {}; } data[splitData[1]][splitData[2]] = frm[key]; } } if (!doc[grp]) { doc[grp] = {}; } for (i = 0, max = data.length; i < max; i += 1) { id = data[i].guid; data[i].nm = nm; data[i].tm = tm; doc[grp][id] = data[i] || {}; } return [doc, 'update complete : [' + grp + ']']; }",
    "delAll": "function (doc, req) { var frm = req.form || {}, grp = frm.grp || 'data'; if (!doc[grp]) { doc[grp] = {}; } else { doc[grp] = { dest: doc[grp].dest, destTag: doc[grp].destTag } } return [doc, 'delete complete : [' + grp + ']']; }"
}


function (doc, req) { var id = req.form.guid, key = req.form.grp || "data", data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } if (!doc[key][id]) { doc[key][id] = []; } doc[key][id].push(data); if (doc[key][id].length > (doc.maxline || 1000)) { doc[key][id].splice(0, doc[key][id].length - (doc.maxline || 1000)); } return [doc, 'insert complete : [' + id + ']']; }


function (doc, req) { var itr, id = req.form.guid, key = req.form.grp || 'data', data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } if (doc[key][id]) { for (itr in data) { doc[key][id][itr] = doc[key][id][itr] ? (doc[key][id][itr] + (parseInt(data[itr], 10))) : (parseInt(data[itr], 10) || 0); } } return [doc, 'add complete : [' + id + ']']; }

function (doc, req) { var id = req.form.guid, key = req.form.grp || 'data', data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } doc[key][id] = data; return [doc, 'update complete : [' + id + ']']; }

function (doc, req) { var id = req.form.guid, key = req.form.grp || 'data'; if (doc[key] && doc[key][id]) { delete doc[key][id]; } return [doc, 'delete complete : [' + id + ']']; }


// save all
savAll = function (doc, req) {
    var i, max, key, id, splitData,
        frm = req.form || {},
        data = [],
        grp = frm.grp || 'data',
        nm = frm.nm || 'anonymous',
        tm = new Date().toString();

    for (key in frm) {
        splitData = key.split(/[\\[\\]]+/g);
        if (splitData.length === 4) {
            if (!data[splitData[1]]) {
                data[splitData[1]] = {};
            }
            data[splitData[1]][splitData[2]] = frm[key];
        }
    }

    if (!doc[grp]) { doc[grp] = {}; }

    for (i = 0, max = data.length; i < max; i += 1) {
        id = data[i].guid;
        data[i].nm = nm;
        data[i].tm = tm;

        doc[grp][id] = data[i] || {};
    }

    return [doc, 'update complete : [' + grp + ']'];
}

// delete all
delAll = function (doc, req) {
    var frm = req.form || {},
        grp = frm.grp || 'data';

    if (!doc[grp]) {
        doc[grp] = {};
    } else {
        doc[grp] = {
            dest: doc[grp].dest,
            destTag: doc[grp].destTag
        }
    }

    return [doc, 'delete complete : [' + grp + ']'];
}


/**
 * transfer
 * @param from {String} Src grp
 * @param to {String} Dst grp
 * @param idx {String} Index of the Object
 * @param guid {String} Id of the Object (optional)
 */
tra = function (doc, req) {
    var key, cnt, splitData,
        frm = req.form || {},
        from = frm.from,
        to = frm.to,
        guid = frm.guid,
        override = {},
        idx = parseInt(frm.idx, 10),
        extend = function (dst, src) {
            var key;
            for (key in src) {
                dst[key] = src[key];
            }
            return dst;
        };

    for (key in frm) {
        if (key.indexOf('override') >= 0) {
            splitData = key.split(/[\\[\\]]+/g);
            if (splitData.length === 3) {
                override[splitData[1]] = frm[key];
            }
        }
    }

    if (!doc[from] || !doc[to]) {
        return [doc, 'transfer failed : [' + from + ' > ' + to + ']'];
    }

    if (guid) {
        doc[to][guid] = extend(doc[from][guid], override);
        delete doc[from][guid];
        return [doc, 'transfer complete : [' + from + ' > ' + to + ' : ' + guid + ']'];
    }

    cnt = 0;
    for (key in doc[from]) {

        if (cnt === idx || key === guid) {
            doc[to][key] = extend(doc[from][key], override);
            delete doc[from][key];
            break;
        }

        cnt += 1;
    }

    return [doc, 'transfer complete : [' + from + ' > ' + to + ']'];
}
