/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

coffee.include("Tile", "tile.html", ["Component"], function (name, ext) {
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
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

});
