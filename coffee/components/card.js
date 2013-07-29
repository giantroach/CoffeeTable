/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

// grp > not in play (like deck)
// grp_$user > binded to the user (like hand)
// grp_$state$ > card is in a "state" and not binded to any user
// grp_$state$_$user > card is in a "state" also binded to the user (played face-down)

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
            var grp = this.get("grp")
                    .replace(/_\$[^$]+$/g, "") // remove user
                    .replace(/_\$[^$]+\$/g, "") // remove state
                    + "_$" + "played" + "$"; // add "played" state

            if (grp === this.get("grp")) {
                return;
            }

            this.sendTra(grp, {
                override: {
                    draggable: true
                },
                dest: "center"
            });
        },

        discard: function () {
            this.sendDel();
            return this;
        },

        take: function () {
            var grp = this.get("grp")
                    .replace(/_\$[^$]+$/g, "") // remove user
                    .replace(/_\$[^$]+\$/g, "") // remove state
                    + "_$" + ext.usr;

            if (grp === this.get("grp")) {
                return;
            }

            this.sendTra(grp, {
                override: {
                    draggable: ""
                },
                dest: "footer"
            });
        }
    });

    // Collection
    c[name] = ext.c.Component.extend({
        contextmenu: {
            items: [
                {
                    label: "play",
                    callback: "play"
                },
                {
                    label: "discard",
                    callback: "discard"
                },
                {
                    label: "take",
                    callback: "take"
                }
            ]
        }
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
                //~ name = this.prototype.name,
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
