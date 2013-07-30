/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */


/**
 * Menu definition format
 * <p>"click"<p>
 * <ul>
 * <li>"component": Component name</li>
 * <li>"method": Method name (collection)</li>
 * <li>"args": Arguments array</li>
 * </ul>
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
     */
    m[name] = ext.m.Component.extend({
    });

    // Collection
    c[name] = ext.c.Component.extend({
        destTag: "ul",
        afterRefresh: function () {
            this.$dest.menu();
        }
    });

    // View
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
