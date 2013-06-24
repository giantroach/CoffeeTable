/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

coffee.include("Die", "die.html", function (name, ext) {
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
     * @param {Object}
     * <ul>
     * <li>faces{Number}:number of die faces</li>
     * </ul>
     */
    m[name] = ext.m.Component.extend({
        roll: function () {
            var face = Math.floor(Math.random() * this.get("faces")) + 1;
            this.set("face", face);
            this.sendSav();

            return face;
        }
    });

    // Collection
    c[name] = ext.c.Component.extend();

    // View
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
