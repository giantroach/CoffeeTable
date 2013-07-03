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
    }, {
        addRandom: function (grp) {
            var name = this.prototype.name,
                m = new ext.m[name],
                templates = this.def.templates[grp],
                rand = _.random(0, templates.length - 1);

            m.set(_.extend({
                grp: grp,
                text: "",
                draggable: true,
                rotate: 0
            }, templates[rand]));

            m.sendSav();
        }
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
