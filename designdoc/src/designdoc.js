// for debug
"function (doc, req) { var key, str = ''; for (key in req.form) { str += (key + ':' + req.form[key] + ';') } return [doc, 'trace : ' + str]; }"


// new one
updates = {
   "trc": "function (doc, req) { var key, str = ''; for (key in req.form) { str += (key + ':\"' + req.form[key] + '\"; ') } return [doc, str]; }",
   "ins": "function (doc, req) { var id = req.form.guid, grp = req.form.grp || 'data', data = req.form || {}; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[grp]) { doc[grp] = {}; } if (!doc[grp].data) { doc[grp].data = []; } doc[grp].data.push(data); if (doc[grp].data.length > (doc.maxline || 1000)) { doc[grp].data.splice(0, doc[grp].data.length - (doc.maxline || 1000)); return [doc, 'insert complete with trancation : [' + id + ']']; } return [doc, 'insert complete : [' + id + ']'];}",
   "sav": "function (doc, req) { var target, id = req.form.guid, grp = req.form.grp || 'data', data = req.form || {}, find = function (ary, id) { var i, max, idx = -1; for (i = 0, max = ary.length; i < max; i += 1) { if (ary[i].guid === id) { idx = i; break; } } return idx; }; data.nm = data.nm || 'anonymous'; data.tm = new Date().toString(); if (!doc[grp]) { doc[grp] = {}; } if (!doc[grp].data) { doc[grp].data = []; } target = find(doc[grp].data, id); if (target < 0) { if (doc[grp].data.length > (doc.maxline || 1000)) { return [doc, 'update failed : exceeding the maxline ' + (doc.maxline || 1000)]; } doc[grp].data.push(data); } else { doc[grp].data[target] = data; } return [doc, 'update complete : [' + id + ']'];}",
   "del": "function (doc, req) { var target, id = req.form.guid, grp = req.form.grp || 'data', find = function (ary, id) { var i, max, idx = -1; for (i = 0, max = ary.length; i < max; i += 1) { if (ary[i].guid === id) { idx = i; break; } } return idx; }; if (!doc[grp]) { return [doc, 'delete failed : grp [' + grp + '] does not exist']; } if (!doc[grp].data) { return [doc, 'delete failed : no data exist in [' + grp + ']']; } target = find(doc[grp].data, id); if (target < 0) { return [doc, 'delete failed : id [' + id + '] does not exist']; } doc[grp].data.splice(target, 1); return [doc, 'delete complete : [' + id + ']'];}",
   "tra": "function (doc, req) { var key, target, splitData, frm = req.form || {}, from = frm.from, to = frm.to, guid = frm.guid, dest = frm.dest, override = {}, idx = parseInt(frm.idx, 10), find = function (ary, id) { var i, max, idx = -1; for (i = 0, max = ary.length; i < max; i += 1) { if (ary[i].guid === id) { idx = i; break; } } return idx; }, extend = function (dst, src) { var key; for (key in src) { dst[key] = src[key]; } return dst; }; for (key in frm) { if (key.indexOf('override') >= 0) { splitData = key.split(/[\\[\\]]+/g); if (splitData.length === 3) { override[splitData[1]] = frm[key]; } } } override.grp = to; override.nm = override.nm || 'anonymous'; override.tm = new Date().toString(); if (!doc[from] || !doc[from].data) { return [doc, 'transfer failed : [' + from + ' > ' + to + '] grp [' + from + '] does not exist.']; } if (!doc[to]) { doc[to] = {}; } if (!doc[to].data) { doc[to].data = []; } if (dest) { doc[to].dest = dest; } if (guid) { target = find(doc[from].data, guid); doc[to].data.push(extend(doc[from].data[target], override)); doc[from].data.splice(target, 1); return [doc, 'transfer complete : [' + from + ' > ' + to + ' : ' + guid + ']']; } if (!doc[from].data[idx]) { return [doc, 'transfer failed : [' + from + ' > ' + to + '] idx [' + idx + ' does not exist.']; } doc[to].data.push(extend(doc[from].data[idx], override)); doc[from].data.splice(idx, 1); return [doc, 'transfer complete : [' + from + ' > ' + to + ']'];}",
    "shu": "function (doc, req) { var shuffled = [], frm = req.form || {}, grp = frm.grp || 'data', rand = function (max) { return parseInt(Math.random() * max, 10) }; if (!doc[grp] || !doc[grp].data) { doc[grp] = {}; return [doc, 'shuffle failed : no data exist [' + grp + ']']; } while (doc[grp].data.length) { shuffled.push(doc[grp].data.splice([rand(doc[grp].data.length)], 1)[0]); } doc[grp].data = shuffled; return [doc, 'shuffle complete : [' + grp + ']'];}",
    "savAll": "function (doc, req) { var i, max, key, id, splitData, target, frm = req.form || {}, data = [], grp = frm.grp || 'data', nm = frm.nm || 'anonymous', tm = new Date().toString(), find = function (ary, id) { var i, max, idx = -1; for (i = 0, max = ary.length; i < max; i += 1) { if (ary[i].guid === id) { idx = i; break; } } return idx; }; for (key in frm) { splitData = key.split(/[\\[\\]]+/g); if (splitData.length === 4) { if (!data[splitData[1]]) { data[splitData[1]] = {}; } data[splitData[1]][splitData[2]] = frm[key]; } } if (!doc[grp]) { doc[grp] = {}; } if (!doc[grp].data) { doc[grp].data = []; } for (i = 0, max = data.length; i < max; i += 1) { id = data[i].guid; data[i].nm = nm; data[i].tm = tm; target = find(doc[grp].data, id); if (target < 0) { doc[grp].data.push(data[i] || {}); if (doc[grp].data.length > (doc.maxline || 1000)) { return [doc, 'update aborted : exceeding the maxline ' + (doc.maxline || 1000)]; } } else { doc[grp].data[target] = data[i] || {}; } } return [doc, 'update complete : [' + grp + ']'];}",
    "delAll": "function (doc, req) { var frm = req.form || {}, grp = frm.grp || 'data'; if (!doc[grp]) { doc[grp] = {}; } else { doc[grp] = { dest: doc[grp].dest, destTag: doc[grp].destTag, usr: doc[grp].usr, data: [] }; } return [doc, 'delete complete : [' + grp + ']'];}",
    "traAll": "function (doc, req) { var key, target, splitData, i, frm = req.form || {}, from = frm.from, to = frm.to, guids = [], dest = frm.dest, override = {}, retStr = '', find = function (ary, id) { var i, max, idx = -1; for (i = 0, max = ary.length; i < max; i += 1) { if (ary[i].guid === id) { idx = i; break; } } return idx; }, extend = function (dst, src) { var key; for (key in src) { dst[key] = src[key]; } return dst; }; for (key in frm) { if (key.indexOf('guids') >= 0) { splitData = key.split(/[\\[\\]]+/g); if (splitData.length === 3) { guids.push(frm[key]); } } } for (key in frm) { if (key.indexOf('override') >= 0) { splitData = key.split(/[\\[\\]]+/g); if (splitData.length === 3) { override[splitData[1]] = frm[key]; } } } override.grp = to; override.nm = frm.nm || 'anonymous'; override.tm = new Date().toString(); if (!doc[from] || !doc[from].data) { return [doc, 'transfer failed : [' + from + ' > ' + to + '] grp [' + from + '] does not exist.']; } if (!doc[to]) { doc[to] = {}; } if (!doc[to].data) { doc[to].data = []; } if (dest) { doc[to].dest = dest; } if (!guids.length) { for (i = doc[from].data.length - 1; 0 <= i; i -= 1) { doc[to].data.unshift(extend(doc[from].data.splice(i, 1)[0], override)); } return [doc, 'transfer complete : [' + from + ' > ' + to + ' : ALL]']; } for (i = guids.length - 1; 0 <= i; i -= 1) { target = find(doc[from].data, guids[i]); if (target >= 0) { doc[to].data.unshift(extend(doc[from].data.splice(target, 1)[0], override)); retStr += (guids[i] + ', '); } } return [doc, 'transfer complete : [' + from + ' > ' + to + ' : ' + retStr + ']'];}",
    "traBac": "function (doc, req) { var key, i, max, j, jmax, splitData, frm = req.form || {}, grp = frm.grp || 'data', dest = frm.dest, rxIsSuffixed = new RegExp('^' + grp + '_\\\\$.+$'), targets = [], override = {}, extend = function (dst, src) { var key; for (key in src) { dst[key] = src[key]; } return dst; }; for (key in doc) { if (rxIsSuffixed.test(key)) { targets.push(key); } } if (!targets.length) { return [doc, 'transfer back failed : [' + grp + '] no target found.']; } for (key in frm) { if (key.indexOf('override') >= 0) { splitData = key.split(/[\\[\\]]+/g); if (splitData.length === 3) { override[splitData[1]] = frm[key]; } } } override.grp = grp; override.nm = frm.nm || 'anonymous'; override.tm = new Date().toString(); if (!doc[grp]) { doc[grp] = {}; } if (!doc[grp].data) { doc[grp].data = []; } if (dest) { doc[grp].dest = dest; } for (i = 0, max = targets.length; i < max; i += 1) { for (j = 0, jmax = doc[targets[i]].data.length; j < jmax; j += 1) { doc[targets[i]].data[j] = extend(doc[targets[i]].data[j], override); } doc[grp].data = doc[grp].data.concat(doc[targets[i]].data); doc[targets[i]].data = []; } return [doc, 'transfer back complete : [' + grp + ']'];}"
}


// insert
var ins = function (doc, req) {
    var id = req.form.guid,
        grp = req.form.grp || 'data',
        data = req.form || {};

    data.nm = data.nm || 'anonymous';
    data.tm = new Date().toString();

    if (!doc[grp]) {
        doc[grp] = {};
    }
    if (!doc[grp].data) {
        doc[grp].data = [];
    }
    doc[grp].data.push(data);

    if (doc[grp].data.length > (doc.maxline || 1000)) {
        doc[grp].data.splice(0, doc[grp].data.length - (doc.maxline || 1000));
        return [doc, 'insert complete with trancation : [' + id + ']'];
    }

    return [doc, 'insert complete : [' + id + ']'];
};

// add
//~ var add = function (doc, req) {
    //~ var itr,
        //~ id = req.form.guid,
        //~ key = req.form.grp || 'data',
        //~ data = req.form || {};

    //~ data.nm = data.nm || 'anonymous';
    //~ data.tm = new Date().toString();

    //~ if (!doc[key]) {
        //~ doc[key] = {};
    //~ }
    //~ if (doc[key][id]) {
        //~ for (itr in data) {
            //~ doc[key][id][itr] = doc[key][id][itr] ? (doc[key][id][itr] + (parseInt(data[itr], 10))) : (parseInt(data[itr], 10) || 0);
        //~ }
    //~ }

    //~ return [doc, 'add complete : [' + id + ']'];
//~ }

// save
var sav = function (doc, req) {
    var target,
        id = req.form.guid,
        grp = req.form.grp || 'data',
        data = req.form || {},

        find = function (ary, id) {
            var i, max,
                idx = -1;

            for (i = 0, max = ary.length; i < max; i += 1) {
                if (ary[i].guid === id) {
                    idx = i;
                    break;
                }
            }
            return idx;
        };

    data.nm = data.nm || 'anonymous';
    data.tm = new Date().toString();

    if (!doc[grp]) {
        doc[grp] = {};
    }
    if (!doc[grp].data) {
        doc[grp].data = [];
    }

    target = find(doc[grp].data, id);
    if (target < 0) {
        if (doc[grp].data.length > (doc.maxline || 1000)) {
            return [doc, 'update failed : exceeding the maxline ' + (doc.maxline || 1000)];
        }
        doc[grp].data.push(data);

    } else {
        doc[grp].data[target] = data;
    }

    return [doc, 'update complete : [' + id + ']'];
};

// delete
var del = function (doc, req) {
    var target,
        id = req.form.guid,
        grp = req.form.grp || 'data',

        find = function (ary, id) {
            var i, max,
                idx = -1;

            for (i = 0, max = ary.length; i < max; i += 1) {
                if (ary[i].guid === id) {
                    idx = i;
                    break;
                }
            }
            return idx;
        };

    if (!doc[grp]) {
        return [doc, 'delete failed : grp [' + grp + '] does not exist'];
    }
    if (!doc[grp].data) {
        return [doc, 'delete failed : no data exist in [' + grp + ']'];
    }

    target = find(doc[grp].data, id);

    if (target < 0) {
        return [doc, 'delete failed : id [' + id + '] does not exist'];
    }

    doc[grp].data.splice(target, 1);

    return [doc, 'delete complete : [' + id + ']'];
};

/**
 * transfer
 * @param from {String} Src grp
 * @param to {String} Dst grp
 * @param idx {String} Index of the Object
 * @param guid {String} Id of the Object (optional)
 * @param dest {String} dest To override the grp dest (optional)
 * @param override {String} Overriding the original data (optional)
 */
var tra = function (doc, req) {
    var key, target, splitData,
        frm = req.form || {},
        from = frm.from,
        to = frm.to,
        guid = frm.guid,
        dest = frm.dest,
        override = {},
        idx = parseInt(frm.idx, 10),

        find = function (ary, id) {
            var i, max,
                idx = -1;

            for (i = 0, max = ary.length; i < max; i += 1) {
                if (ary[i].guid === id) {
                    idx = i;
                    break;
                }
            }
            return idx;
        },

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
    override.grp = to;
    override.nm = frm.nm || 'anonymous';
    override.tm = new Date().toString();

    if (!doc[from] || !doc[from].data) {
        return [doc, 'transfer failed : [' + from + ' > ' + to + '] grp [' + from + '] does not exist.'];
    }

    if (!doc[to]) {
        doc[to] = {};
    }
    if (!doc[to].data) {
        doc[to].data = [];
    }

    if (dest) {
        doc[to].dest = dest;
    }

    if (guid) {
        target = find(doc[from].data, guid);
        doc[to].data.push(extend(doc[from].data[target], override));
        doc[from].data.splice(target, 1);
        return [doc, 'transfer complete : [' + from + ' > ' + to + ' : ' + guid + ']'];
    }

    if (!doc[from].data[idx]) {
        return [doc, 'transfer failed : [' + from + ' > ' + to + '] idx [' + idx + ' does not exist.'];
    }
    doc[to].data.push(extend(doc[from].data[idx], override));
    doc[from].data.splice(idx, 1);

    return [doc, 'transfer complete : [' + from + ' > ' + to + ']'];
};

// shuffle
var shu = function (doc, req) {
    var shuffled = [],
        frm = req.form || {},
        grp = frm.grp || 'data',

        rand = function (max) {
            return parseInt(Math.random() * max, 10)
        };

    if (!doc[grp] || !doc[grp].data) {
        doc[grp] = {};
        return [doc, 'shuffle failed : no data exist [' + grp + ']'];

    }

    while (doc[grp].data.length) {
        shuffled.push(doc[grp].data.splice([rand(doc[grp].data.length)], 1)[0]);
    }

    doc[grp].data = shuffled;

    return [doc, 'shuffle complete : [' + grp + ']'];
};

// save all
var savAll = function (doc, req) {
    var i, max, key, id, splitData, target,
        frm = req.form || {},
        data = [],
        grp = frm.grp || 'data',
        nm = frm.nm || 'anonymous',
        tm = new Date().toString(),

        find = function (ary, id) {
            var i, max,
                idx = -1;

            for (i = 0, max = ary.length; i < max; i += 1) {
                if (ary[i].guid === id) {
                    idx = i;
                    break;
                }
            }
            return idx;
        };

    for (key in frm) {
        splitData = key.split(/[\\[\\]]+/g);
        if (splitData.length === 4) {
            if (!data[splitData[1]]) {
                data[splitData[1]] = {};
            }
            data[splitData[1]][splitData[2]] = frm[key];
        }
    }

    if (!doc[grp]) {
        doc[grp] = {};
    }
    if (!doc[grp].data) {
        doc[grp].data = [];
    }

    for (i = 0, max = data.length; i < max; i += 1) {
        id = data[i].guid;
        data[i].nm = nm;
        data[i].tm = tm;

        target = find(doc[grp].data, id);
        if (target < 0) {
            doc[grp].data.push(data[i] || {});
            if (doc[grp].data.length > (doc.maxline || 1000)) {
                return [doc, 'update aborted : exceeding the maxline ' + (doc.maxline || 1000)];
            }

        } else {
            doc[grp].data[target] = data[i] || {};
        }
    }

    return [doc, 'update complete : [' + grp + ']'];
};

// delete all
var delAll = function (doc, req) {
    var frm = req.form || {},
        grp = frm.grp || 'data';

    if (!doc[grp]) {
        doc[grp] = {};
    } else {
        doc[grp] = {
            dest: doc[grp].dest,
            destTag: doc[grp].destTag,
            usr: doc[grp].usr,
            data: []
        };
    }

    return [doc, 'delete complete : [' + grp + ']'];
};

/**
 * transfer (multiple targets)
 * @param from {String} Src grp
 * @param to {String} Dst grp
 * @param guids {String[]} Id of the Object (optional) all if not specified.
 * @param dest {String} dest To override the grp dest (optional)
 * @param override {String} Overriding the original data (optional)
 */
var traAll = function (doc, req) {
    var key, target, splitData, i,
        frm = req.form || {},
        from = frm.from,
        to = frm.to,
        guids = [],
        dest = frm.dest,
        override = {},
        retStr = '',

        find = function (ary, id) {
            var i, max,
                idx = -1;

            for (i = 0, max = ary.length; i < max; i += 1) {
                if (ary[i].guid === id) {
                    idx = i;
                    break;
                }
            }
            return idx;
        },

        extend = function (dst, src) {
            var key;
            for (key in src) {
                dst[key] = src[key];
            }
            return dst;
        };

    for (key in frm) {
        if (key.indexOf('guids') >= 0) {
            splitData = key.split(/[\\[\\]]+/g);
            if (splitData.length === 3) {
                guids.push(frm[key]);
            }
        }
    }

    for (key in frm) {
        if (key.indexOf('override') >= 0) {
            splitData = key.split(/[\\[\\]]+/g);
            if (splitData.length === 3) {
                override[splitData[1]] = frm[key];
            }
        }
    }
    override.grp = to;
    override.nm = frm.nm || 'anonymous';
    override.tm = new Date().toString();

    if (!doc[from] || !doc[from].data) {
        return [doc, 'transfer failed : [' + from + ' > ' + to + '] grp [' + from + '] does not exist.'];
    }

    if (!doc[to]) {
        doc[to] = {};
    }
    if (!doc[to].data) {
        doc[to].data = [];
    }

    if (dest) {
        doc[to].dest = dest;
    }

    if (!guids.length) {
        for (i = doc[from].data.length - 1; 0 <= i; i -= 1) {
            doc[to].data.unshift(extend(doc[from].data.splice(i, 1)[0], override));
        }
        return [doc, 'transfer complete : [' + from + ' > ' + to + ' : ALL]'];
    }

    for (i = guids.length - 1; 0 <= i; i -= 1) {
        target = find(doc[from].data, guids[i]);
        if (target >= 0) {
            doc[to].data.unshift(extend(doc[from].data.splice(target, 1)[0], override));
            retStr += (guids[i] + ', ');
        }
    }

    return [doc, 'transfer complete : [' + from + ' > ' + to + ' : ' + retStr + ']'];
};




// reset all suffixed grp into original grp
var traBac = function (doc, req) {
    var key, i, max, j, jmax, splitData,
        frm = req.form || {},
        grp = frm.grp || 'data',
        dest = frm.dest,
        rxIsSuffixed = new RegExp('^' + grp + '_\\\\$.+$'),
        targets = [],
        override = {},

        extend = function (dst, src) {
            var key;
            for (key in src) {
                dst[key] = src[key];
            }
            return dst;
        };

    for (key in doc) {
        if (rxIsSuffixed.test(key)) {
            targets.push(key);
        }
    }

    if (!targets.length) {
        return [doc, 'transfer back failed : [' + grp + '] no target found.'];
    }

    for (key in frm) {
        if (key.indexOf('override') >= 0) {
            splitData = key.split(/[\\[\\]]+/g);
            if (splitData.length === 3) {
                override[splitData[1]] = frm[key];
            }
        }
    }
    override.grp = grp;
    override.nm = frm.nm || 'anonymous';
    override.tm = new Date().toString();

    if (!doc[grp]) {
        doc[grp] = {};
    }
    if (!doc[grp].data) {
        doc[grp].data = [];
    }

    if (dest) {
        doc[grp].dest = dest;
    }

    for (i = 0, max = targets.length; i < max; i += 1) {
        for (j = 0, jmax = doc[targets[i]].data.length; j < jmax; j += 1) {
            doc[targets[i]].data[j] = extend(doc[targets[i]].data[j], override);
        }

        doc[grp].data = doc[grp].data.concat(doc[targets[i]].data);
        doc[targets[i]].data = [];
    }

    return [doc, 'transfer back complete : [' + grp + ']'];
};
