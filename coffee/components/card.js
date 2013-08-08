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
        v = {},

        /**
         * @method genNewGrpStr
         * @param {String} grp
         * @param {Object} param
         */
        genNewGrpStr = function (grp, param) {
            grp = grp
                .replace(/_\$[^$]+$/g, "") // remove user
                .replace(/_\$[^$]+\$/g, ""); // remove state;

            if (param && param.state) {
                grp += ("_$" + param.state + "$");
            }
            if (param && param.usr) {
                grp += ("_$" + param.usr);
            }

            return grp;
        };


    /**
     * Model
     */
    m[name] = ext.m.Component.extend({
        genNewGrpStr: function (param) {
            return genNewGrpStr(this.get("grp"), param);
        },

        play: function () {
            var centerPos,
                grp = this.genNewGrpStr({
                    state: "played"
                });

            if (grp === this.get("grp")) {
                return;
            }

            centerPos = ext.c.Frame.getCenterCoordinate({
                height: this.view.$el.height(),
                width: this.view.$el.width()
            });

            this.sendTra({
                to: grp,
                override: {
                    draggable: true,
                    css_px_left: centerPos.x,
                    css_px_top: centerPos.y
                },
                dest: "center"
            });
        },

        discard: function () {
            var grp = this.genNewGrpStr({
                state: "discarded"
            });

            if (grp === this.get("grp")) {
                return;
            }

            this.sendTra({
                to: grp,
                override: {
                    draggable: ""
                },
                dest: ""
            });
            return this;
        },

        take: function () {
            var grp = this.genNewGrpStr({
                usr: ext.usr
            });

            if (grp === this.get("grp")) {
                return;
            }

            this.sendTra({
                to: grp,
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
         * @method resetDeck
         * @param {String} grp
         * @param {String} withoutShuffle (optional)
         * @return {this}
         */
        resetDeck: function (grp, withoutShuffle) {
            var that = this;

            this.sendTraBac(grp, null, function () {
                that.sendResTem(grp, null, function () {
                    if (!withoutShuffle) {
                        that.sendShu(grp);
                    }
                });
            });
        },

        /**
         * Reset target deck
         * @method resetDeck
         * @param {String} grp
         * @param {shuffle}
         * @return {this}
         */
        shuffleIntoDeck: function (grp, shuffle) {
            var that = this,
                models = [];

            this.sendTraBac(grp, null, function () {
                if (shuffle || shuffle === undefined) {
                    that.sendShu(grp);
                }
            });

            return this;
        },

        /**
         * Put all discarded cards into a deck and shuffle again
         * @method reShuffle
         * @param {String} grp
         */
        reShuffle: function (grp) {
            this.sendTraAll(grp + "_$discarded$", {
                to: grp
            });

            return this;
        },

        drawTake: function () {
            this.take.apply(this, arguments);
        },

        /**
         * draw init card, and refill the init deck
         * @method initDraw
         * @param {String} from grp
         * @param {String} to (optional) if not specified, u draw to ur hand
         * @param {Object} override(optional)
         * @param {Function} suc
         * @param {Function} err
         * @return {this}
         */
        initDraw: function (from, to, override, suc, err) {
            var that = this;

            if (!to) {
                to = genNewGrpStr(from, {
                    usr: ext.usr
                });
            }

            if (!override) {
                override = {};
            }

            if (from === to) {
                return;
            }

            this.sendResTem(from, null, function () {
                that.sendTraAll(from, {
                    to: to,
                    dest: "footer",
                    override: override
                }, suc, err);
            }, err);

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
