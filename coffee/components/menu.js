/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

// Menu definition format
// <p>"click"<p>
// <ul>
// <li>"component": Component name</li>
// <li>"method": Method name (collection)</li>
// <li>"args": Arguments array</li>
// </ul>


/**
 * @module Menu
 * @namespace coffee
 * @requires Component
 */

coffee.include("Menu", "menu.html", ["Component"], function (name, ext) {
    "use strict";

    var $ = ext.$,
        Backbone = ext.Backbone,

        m = {},
        c = {},
        r = {},
        v = {};


    /**
     * Model
     * @class m.Menu
     * @submodule m.Component
     * @constructor
     */
    m[name] = ext.m.Component.extend({
    });


    /**
     * Collection
     * @class c.Menu
     * @submodule c.Component
     * @constructor
     */
    c[name] = ext.c.Component.extend({
        destTag: "ul",
        afterRefresh: function () {
            this.$dest.menu();
        }
    });


    /**
     * View
     * @class v.Menu
     * @submodule v.Component
     * @constructor
     */
    v[name] = ext.v.Component.extend({
        // html definition
        tagName: "li",

        // function
        init: function () {
            _.bindAll(this, ["hndlEvent"]);
        },

        events: {
            click: "hndlEvent"
        },

        hndlEvent: function (e) {
            var component,
                handler = this.model.get(e.type);

            if (handler) {
                component = ext.c[handler.component];
                component[handler.method].apply(component, handler.args);

                // write log
                ext.c.Log.send({
                    type: "action",
                    text: this.$el.text().replace(/[\n\r]/g, "")
                });
            }
        }
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

});
