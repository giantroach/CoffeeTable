/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

/**
 * @module Piece
 * @namespace coffee
 * @requires Component, Card
 */

coffee.include("Piece", "piece.html", ["Component", "Card"], function (name, ext) {
    "use strict";

    var $ = ext.$,
        Backbone = ext.Backbone,

        m = {},
        c = {},
        r = {},
        v = {};


    /**
     * Model
     * @class m.Piece
     * @submodule m.Component
     * @constructor
     */
    m[name] = ext.m.Card.extend({
    });


    /**
     * Collection
     * @class c.Piece
     * @submodule c.Component
     * @constructor
     */
    c[name] = ext.c.Card.extend({
    });


    /**
     * View
     * @class v.Piece
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
