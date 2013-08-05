/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

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
     */
    m[name] = ext.m.Card.extend({
    });

    // Collection
    c[name] = ext.c.Card.extend({
    }, {
        //~ /**
         //~ * Add Random tile to specified group
         //~ * @method addRandom
         //~ * @param {String} grp
         //~ * @return {this}
         //~ */
        //~ addRandom: function (grp) {
            //~ var name = this.prototype.name,
                //~ m = new ext.m[name],
                //~ templates = this.def.templates[grp],
                //~ rand = _.random(0, templates.length - 1);

            //~ m.set(_.extend({
                //~ grp: grp,
                //~ text: "",
                //~ draggable: true,
                //~ rotate: 0
            //~ }, templates[rand]));

            //~ m.sendSav();

            //~ return this;
        //~ },

        //~ /**
         //~ * Add specified tile to specified group
         //~ * @method addThis
         //~ * @param {String} grp
         //~ * @param {Object} args
         //~ * <ul>
         //~ * <li>cls: class to adding the tile.</li>
         //~ * </ul>
         //~ * @return {this}
         //~ */
        //~ addThis: function (grp, args) {
            //~ var name = this.prototype.name,
                //~ m = new ext.m[name],
                //~ template = _.find(this.def.templates[grp], function (obj) {
                    //~ return obj.cls === args.cls;
                //~ });

            //~ m.set(_.extend({
                //~ grp: grp,
                //~ text: "",
                //~ draggable: true,
                //~ rotate: 0
            //~ }, template));

            //~ m.sendSav();

            //~ return this;
        //~ }
    });

    // View
    v[name] = ext.v.Card.extend({
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

});
