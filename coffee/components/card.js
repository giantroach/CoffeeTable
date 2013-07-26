/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

coffee.include("Card", "card.html", ["Component", "Contextmenu"], function (name, ext) {
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
        play: function () {
            this.sendTra("play");
        },
        discard: function () {
            this.sendDel();
            return this;
        }
    });

    // Collection
    c[name] = ext.c.Component.extend({
    }, {
        default_def: {
        },

        /**
         * Reset target deck
         * @method reset
         * @param {String} grp
         */
        shuffle: function (grp) {
            var i, max,
                that = this,
                name = this.prototype.name,
                models = [],
                templates = _.extend([], this.def.templates[grp]);

            templates = _.shuffle(templates);
            for (i = 0, max = templates.length; i < max; i += 1) {
                models.push(
                    (new ext.m[name]())
                        .set(_.extend({
                            grp: grp
                        }, templates[i]))
                );
            }
            ext.c[name].children[name][grp].reset(models);

            this.updateAll("delAll", grp, null, function () {
                that.updateAll("savAll", grp);
            });

            return this;
        },

        /**
         * draw
         * @method draw
         * @param {String} from
         * @param {String} to
         * @param {Number} idx(optional)
         * @param {Function} suc
         * @param {Function} err
         * @return {this}
         */
        draw: function (from, to, idx, suc, err) {
            if (idx === undefined) {
                idx = 0;
            }

            this.send("tra", this.prototype.name, {
                from: from,
                to: to,
                idx: idx
            }, suc, err);

            return this;
        }
    });

    // View
    v[name] = ext.v.Component.extend({
        defData: {
            title: "",
            text: ""
        }
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

});
