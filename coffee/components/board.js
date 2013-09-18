/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

/**
 * @module Board
 * @namespace coffee
 * @requires Component
 */

coffee.include("Board", "board.html", ["Component"], function (name, ext) {
    "use strict";

    var $ = ext.$,
        Backbone = ext.Backbone,

        Math = ext.w.Math,

        m = {},
        c = {},
        r = {},
        v = {};


    /**
     * Model
     * @class m.Board
     * @submodule m.Component
     * @constructor
     */
    m[name] = ext.m.Component.extend({
    });


    /**
     * Collection
     * @class c.Board
     * @submodule c.Component
     * @constructor
     */
    c[name] = ext.c.Component.extend();


    /**
     * View
     * @class v.Board
     * @submodule v.Component
     * @constructor
     */
    v[name] = ext.v.Component.extend({
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

});
