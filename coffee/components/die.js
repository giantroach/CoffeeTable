/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

/**
 * @module Die
 * @namespace coffee
 * @requires Component
 */

coffee.include("Die", "die.html", ["Component"], function (name, ext) {
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
     * @class m.Die
     * @param {Object}
     * <ul>
     * <li>faces{Number}:number of die faces</li>
     * </ul>
     * @submodule m.Component
     * @constructor
     */
    m[name] = ext.m.Component.extend({
        /**
         * Roll this die
         * @method roll
         * @return {Number} face
         */
        roll: function () {
            var face = Math.floor(Math.random() * this.get("faces")) + 1;
            this.set("face", face);
            this.sendSav();

            return face;
        }
    });


    /**
     * Collection
     * @class c.Die
     * @submodule c.Component
     * @constructor
     */
    c[name] = ext.c.Component.extend();


    /**
     * View
     * @class v.Die
     * @submodule v.Component
     * @constructor
     */
    v[name] = ext.v.Component.extend({
        events: {
            "click": "roll"
        },

        roll: function () {
            this.model.roll();
        }
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

});
