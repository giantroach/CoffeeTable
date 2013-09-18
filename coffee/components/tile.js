/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

/**
 * @module Tile
 * @namespace coffee
 * @requires Component, Card
 */

coffee.include("Tile", "tile.html", ["Component", "Card"], function (name, ext) {
    "use strict";

    var $ = ext.$,
        Backbone = ext.Backbone,

        m = {},
        c = {},
        r = {},
        v = {};


    /**
     * Model
     * @class m.Tile
     * @submodule m.Component
     * @constructor
     */
    m[name] = ext.m.Card.extend({
    });


    /**
     * Collection
     * @class c.Tile
     * @submodule c.Component
     * @constructor
     */
    c[name] = ext.c.Card.extend({
    });


    /**
     * View
     * @class v.Tile
     * @submodule v.Component
     * @constructor
     */
    v[name] = ext.v.Card.extend({
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

});
