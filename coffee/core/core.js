/*jslint browser: true, nomen: true, indent: 4 */
/*global jQuery, _, Backbone */

var coffee = (function (ext) {
    "use strict";

    var $ = ext.jQuery,
        _ = ext._,
        Backbone = ext.Backbone,

        w = window,
        d = w.document,

        def = {
            fw: "coffee",
            project: "coffee",
            componentsRoot: "components",
            HTTP_TIMEOUT: 2000
        },

        loading = [];


    return {
        $: $,
        _: _,
        Backbone: Backbone,

        def: def,

        m: {},
        c: {},
        r: {},
        v: {},

        w: w,
        d: d,

        /**
         * Include component into coffee name space
         * @method include
         * @param {String} arg1 name
         * @param {String} arg2 URI to load html (Optional)
         * @param {Function} arg3 callback
         * @return {this}
         */
        include: function (name, arg2, arg3) {
            var uri = arg3 ? arg2 : "",
                func = arg3 || arg2;

            if (uri) {
                // if uri is specified, load html and append it as template
                loading.push(name);
                this.include_html(uri, function (str) {
                    this.include_js(name, func);
                    this.v[name] = this.v[name].extend({
                        template: _.template(this.cssForge(str, name))
                    });
                    loading = _.without(loading, name);
                });

            } else {
                // if no uri is specified, just include html
                this.include_js(name, func);
            }

            return this;
        },

        /**
         * Include component into coffee name space
         * @method include_html
         * @param {String} uri
         * @param {Function} func
         * @return {this}
         */
        include_html: function (uri, func) {
            var that = this;
            $.get("/" + this.def.project + "/" + this.def.componentsRoot + "/" + uri, function () {
                func.apply(that, arguments);
            });
            return this;
        },

        /**
         * Include component into coffee name space
         * @method include
         * @param {String} name
         * @param {Function} func
         * @return {this}
         */
        include_js: function (name, func) {
            var key,
                obj = func(name, this);

            // add "name" property for all objects, and then add it to "this"
            for (key in obj) {
                if (obj.hasOwnProperty(key) && obj[key]) {
                    this[key][name] = obj[key].extend({
                        name: name
                    });
                }
            }

            return this;
        },

        /**
         * Combine multiple css into one to avoid several problems
         * @method cssForge
         * @param {String} html Style text which to be merged
         * @return {String} Remainings of style
         */
        cssForge: (function () {
            var forge = document.getElementById("cssforge");

            // if forge isn't prepared
            if (!forge) {
                forge = d.createElement("div");
                forge.id = "cssforge";
                $(d.body).append(forge);
            }

            return function (html, id) {
                var stampFragment,
                    stamp = "/*### " + (id || "") + " ###*/\r\n",

                    rxStyle = /<\/?style[^>]*>/gi,
                    htmlFragment = html.split(rxStyle),
                    melt = forge.innerHTML.split(rxStyle);

                // if there's no style tag (as there can be given id in the forge, we still have to proceed)
                if (htmlFragment.length === 1) {
                    htmlFragment = ["", html, ""];
                }

                // if forge is empty or no corresponding stump is found
                if (melt.length === 1) {
                    melt = ["", melt[0], ""];
                }

                // check if the given id is already forged
                if (melt[1].search(stamp) >= 0) {
                    stampFragment = melt[1].split(stamp);
                    melt[1] = stampFragment[0] + stampFragment[2];
                }

                forge.innerHTML = '<div>&nbsp;</div><style type="text/css">' + melt[1] + stamp + htmlFragment[1] + stamp + '</style>';

                return htmlFragment[0] + htmlFragment[2];
            };
        }()),

        /**
         * Generate GUID
         * @method genGuid
         * @param {String} prefix Prefix (optional)
         * @return {String} GUID
         */
        genGuid: (function () {
            var s4 = function () {
                return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
            };

            return function (prefix) {
                return (prefix || "") +
                    s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };
        }()),

        // collections
        cs: {},

        /**
         * Start Polling for document update
         * @method startPolling
         * @return {this}
         */
        startPolling: (function () {
            $(d).bind('longpoll-data-' + def.project, function(evt, data) {
                var i, max,
                    cs = w.coffee.cs;

                for (i = 0, max = data.length; i < max; i += 1) {
                    if (cs[data[i].id] && cs[data[i].id].refresh) {
                        cs[data[i].id].refresh();
                    }
                }
            });

            return function () {
                $.couch.longpoll(def.project);
                return this;
            };
        }()),

        /**
         * @method letsPlay
         * @return {this}
         */
        letsPlay: function () {
            var key,
                that = this,
                c = this.c;

            if (loading.length) {
                return w.setTimeout(function () {
                    that.letsPlay.apply(that, arguments);
                }, 100);
            }

            for (key in c) {
                if (c.hasOwnProperty(key)) {
                    this.cs[key] = c[key];
                }
            }

            this.startPolling();

            return this;
        }
    };

}({
    //library
    jQuery : jQuery,
    _ : _,
    Backbone : Backbone
}));
