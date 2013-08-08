/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

coffee.include("Contextmenu", "contextmenu.html", ["Component"], function (name, ext) {
    "use strict";

    var $ = ext.$,
        Backbone = ext.Backbone,
        d = ext.d,

        m = {},
        c = {},
        r = {},
        v = {},

        collection,
        model;


    /**
     * Model
     */
    m[name] = ext.m.Component.extend({
        init: function () {
            this.c.constructor.children[name] = this.c.constructor.children[name] || [];
            this.c.constructor.children[name].push(this);
            this.set({
                hide: true
            });

            return this;
        },

        callback: function (label) {
            var item = _.find(this.get("items"), function (item) {
                return item.label === label;
            });
            if (item) {
                this.lastModel[item.callback].apply(this.lastModel, item.args);
            }
        }
    });

    // Collection
    c[name] = ext.c.Component.extend({
    }, {
        /**
         * hide all contextmenu
         */
        hideAll: function () {
            _.each(this.children[name], function (model) {
                model.set({
                    hide: true
                });
            });
            return this;
        }
    });

    // View
    v[name] = ext.v.Component.extend({
        noAnim: true,

        init: function (opt) {
        },

        afterRender: function () {
            var gap;

            this.$el.find("ul").menu();

            // adjust display pos onto body
            gap = d.body.clientHeight - this.el.offsetTop - this.el.clientHeight;
            if (gap < 0) {
                this.$el.css({
                  top: this.el.offsetTop + gap + "px"
                });
            }
        },

        defData: {
            title: "",
            text: ""
        },

        events: {
            "click": "menuHandle"
        },

        menuHandle: function (args) {
            // target.innerHTML === label
            this.model.callback(args.target.innerHTML)
        }
    });


    // hide all contextmenu when doc is clicked
    ext.onDoc("click", function () {
        c[name].hideAll();
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

});
