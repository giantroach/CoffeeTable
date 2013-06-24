// old one
{
   "trace": "function (doc, req) { var key, str = ''; for (key in req.form) { str += (key + ':\"' + req.form[key] + '\"; ') } return [doc, str]; }",
   "insert": "function (doc, req) { var id = req.form.id, data = req.form.data || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[id]) { doc[id] = []; } doc[id].push(data); if (doc[id].length > (doc.maxline || 1000)) { doc[id].splice(0, doc[id].length - (doc.maxline || 1000)); } return [doc, 'insert complete.' + req.form.id]; }",
   "add": "function (doc, req) { var key, offsets = req.form; if (doc.counters) { for (key in offsets) { doc.counters[key] = doc.counters[key] ? (doc.counters[key] + (parseInt(offsets[key], 10))) : (parseInt(offsets[key], 10) || 0); } } return [doc, 'add complete.']; }",
   "piecePos": "function (doc, req) { var i, max, id = req.form.target; if (doc.pos) { for (i = 0, max = doc.pos.length; i < max; i += 1) { if (doc.pos[i].id === id) { doc.pos[i].x = req.form.x; doc.pos[i].y = req.form.y; doc.pos[i].lastRev = doc._rev; return [doc, 'updated']; } } doc.pos.push({ id : id, cls : req.form.cls, x : req.form.x || 0, y : req.form.y || 0, lastRev : doc._rev }); return [doc, 'added']; } }",
   "pieceDel": "function (doc, req) { var i, id = req.form.target; for (i = doc.pos.length - 1; 0 <= i; i -= 1) { if (doc.pos[i].id === id) { doc.pos.splice(i, 1); } } return [doc, 'deleted']; }"
}





// new one
{
   "trc": "function (doc, req) { var key, str = ''; for (key in req.form) { str += (key + ':\"' + req.form[key] + '\"; ') } return [doc, str]; }",
   "ins": "function (doc, req) { var id = req.form.guid, key = req.form.grp || 'data', data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } if (!doc[key][id]) { doc[key][id] = []; } doc[key][id].push(data); if (doc[key][id].length > (doc.maxline || 1000)) { doc[key][id].splice(0, doc[key][id].length - (doc.maxline || 1000)); } return [doc, 'insert complete : [' + id + ']']; }",
   "add": "function (doc, req) { var itr, id = req.form.guid, key = req.form.grp || 'data', data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } if (doc[key][id]) { for (itr in data) { doc[key][id][itr] = doc[key][id][itr] ? (doc[key][id][itr] + (parseInt(data[itr], 10))) : (parseInt(data[itr], 10) || 0); } } return [doc, 'add complete : [' + id + ']']; }",
   "sav": "function (doc, req) { var id = req.form.guid, key = req.form.grp || 'data', data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } doc[key][id] = data; return [doc, 'update complete : [' + id + ']']; }",
   "del": "function (doc, req) { var id = req.form.guid, key = req.form.grp || 'data'; if (doc[key] && doc[key][id]) { delete doc[key][id]; } return [doc, 'delete complete : [' + id + ']']; }"
}


function (doc, req) { var id = req.form.guid, key = req.form.grp || "data", data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } if (!doc[key][id]) { doc[key][id] = []; } doc[key][id].push(data); if (doc[key][id].length > (doc.maxline || 1000)) { doc[key][id].splice(0, doc[key][id].length - (doc.maxline || 1000)); } return [doc, 'insert complete : [' + id + ']']; }


function (doc, req) { var itr, id = req.form.guid, key = req.form.grp || 'data', data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } if (doc[key][id]) { for (itr in data) { doc[key][id][itr] = doc[key][id][itr] ? (doc[key][id][itr] + (parseInt(data[itr], 10))) : (parseInt(data[itr], 10) || 0); } } return [doc, 'add complete : [' + id + ']']; }

function (doc, req) { var id = req.form.guid, key = req.form.grp || 'data', data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[key]) { doc[key] = {}; } doc[key][id] = data; return [doc, 'update complete : [' + id + ']']; }

function (doc, req) { var id = req.form.guid, key = req.form.grp || 'data'; if (doc[key] && doc[key][id]) { delete doc[key][id]; } return [doc, 'delete complete : [' + id + ']']; }