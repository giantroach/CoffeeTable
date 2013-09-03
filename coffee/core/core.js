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
            project: String(w.location)
                .replace(/(\/[^/]+){2}$/g, "") // remove core/core.html
                .replace(/^.+\/\/[^/]+\//g, ""),
            componentsRoot: "components",
            HTTP_TIMEOUT: 2000
        },

        loading = [];


    //disable contextmenu for components like rotate option
    $(d).bind("contextmenu", function () {
        return false;
    });


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
         * @param {String} name name
         * @param {String} arg2 URI to load html (Optional)
         * @param {Array} arg3 Array of dependency
         * @param {Function} arg4 callback
         * @param {Object} arg4 option (optional)
         * <ul>
         * <li>loadCssImmediate{Boolean}: if loads css immediate without using template.</li>
         * </ul>
         * @return {this}
         */
        include: function (name, arg2, arg3, arg4, arg5) {
            var uri, dependencies, func, opt,
                args = arguments,
                that = this;

            if (typeof arg2 === "string") {
                uri = arg2;
                dependencies = arg3 || [];
                func = arg4;
                opt = arg5 || {};

            } else {
                uri = "";
                dependencies = arg2 || [];
                func = arg3;
                opt = arg4 || {};
            }

            // set delay if module defined some dependencies
            if (_.find(loading, function (module) { return _.contains(dependencies, module); })
                    || (dependencies.length && dependencies.length !== _.filter(dependencies, function (module) { return _.contains(_.keys(that.m), module) }).length)) {
                setTimeout(function () {
                    that.include.apply(that, args);
                }, 100);
                return this;
            }

            if (uri) {
                // if uri is specified, load html and append it as template
                loading.push(name);
                this.include_html(uri, function (str) {
                    var fragments, htmlTemplate, cssTemplate;

                    if (opt.loadCssImmediate) {
                        htmlTemplate = _.template(this.cssForge(str, name));
                        cssTemplate = null;

                    } else {
                        fragments = this.cssForge(str, name, {
                            cssLoadDelay: true
                        });

                        htmlTemplate = _.template(fragments[0]);
                        cssTemplate = _.template(fragments[1]);
                    }

                    this.include_js(name, func);
                    this.v[name] = this.v[name].extend({
                        template: htmlTemplate
                    });

                    this.c[name].css = cssTemplate;
                    loading = _.without(loading, name);

                });

            } else {
                // if no uri is specified, just include javascript
                this.include_js(name, func);
                loading = _.without(loading, name);
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
            var key, obj;

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
         * @param {Object} opt Options below
         * <ul>
         * <li>cssLoadDelay{Boolean}: Do not Append css. When this option is given, returns array of [HTML, CSS] instead.</li>
         * <li>loadThisCss{Boolean}: load given "html" argument as css.</li>
         * </ul>
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

            return function (html, id, opt) {
                var htmlFragment, melt, stampFragment,
                    stamp = "/*### " + (id || "") + " ###*/\r\n",

                    rxStyle = /<\/?style[^>]*>/gi;

                // HTML
                if (opt && opt.loadThisCss) {
                    htmlFragment = ["", html, ""];
                } else {
                    htmlFragment = html.split(rxStyle);
                }

                // if there's no style tag (as there can be given id in the forge, we still have to proceed)
                if (htmlFragment.length === 1) {
                    htmlFragment = [html, "", ""];
                }

                if (opt && opt.cssLoadDelay) {
                    return [htmlFragment[0] + htmlFragment[2], htmlFragment[1]];
                }

                // CSS
                melt = forge.innerHTML.split(rxStyle);
                // if forge is empty or no corresponding stump is found
                if (melt.length === 1) {
                    melt = ["", melt[0], ""];
                }

                // check if the given id is already forged
                if (melt[1].search(stamp) >= 0) {
                    stampFragment = melt[1].split(stamp);
                    melt[1] = stampFragment[0] + stampFragment[2];
                }

                // Do forge
                forge.innerHTML = '<div>&nbsp;</div><style type="text/css">' + melt[1] + stamp + htmlFragment[1] + stamp + '</style>';

                return htmlFragment[0] + htmlFragment[2];
            };
        }()),

        /**
         * subscribe event related to document
         * @method onDoc
         * @param {String} event Event name like "click"
         * @param {String} callback Callback function
         * @return {this}
         */
        onDoc: (function () {
            var handler = {};
            $(d).bind("click", function () {
                var that = this,
                    args = arguments;

                _.each(handler.click, function (callback) {
                    callback.apply(that, args);
                });
            });

            return function (event, callback) {
                if (!handler[event]) {
                    handler[event] = [];
                }
                handler[event].push(callback);
                return this;
            };
        }()),

        /**
         * subscribe window resize event.
         * @method onResize
         * @param callback {Function}
         * @return {this}
         */
        onResize: (function () {
            var timeout,
                handlers = [];

            $(w).resize(function () {
                var that = this,
                    args = arguments;

                clearTimeout(timeout);
                timeout = w.setTimeout(function () {
                    _.each(handlers, function (callback) {
                        //callback gets args of
                        // x(width), y(height), original-args
                        callback.apply(that, _.union([that.innerWidth, that.innerHeight], args));
                    });
                }, 100);
            });

            return function (callback) {
                handlers.push(callback);
                return this;
            };
        }()),

        /**
         * Convert back CSS text to some how convenient form
         * @method cssConverter
         * @param {String} str Css text which is escaped by <%-
         * @param {String} name Name for trace (optional)
         * @return {String}
         */
        cssConverter: function (str, name) {
            str = str || "";

            if (str.indexOf("javascript") >= 0 || str.indexOf("expression") >= 0) {
                w.alert("Suspicious CSS detected" + (name ? " [" + name + "] " : "") + ". Css disabled.");
                return "";
            }

            // replace back "/"
            str = str.replace(/&#x2F;/g, "/");

            return str;
        },

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
            $(d).bind('longpoll-data-' + def.project, function (evt, data) {
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

            // wait for all components to be loaded
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

            this.c.Login.start(function () {
                that.c.Frame.setup(function () {
                    that.startPolling();
                });
            });

            return this;
        }
    };

}({
    //library
    jQuery : jQuery,
    _ : _,
    Backbone : Backbone
}));
