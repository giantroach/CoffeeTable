/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

coffee.include("Component", "components.html", [], function (name, ext) {
    "use strict";

    var _ = ext._,
        $ = ext.$,
        Backbone = ext.Backbone,
        m = {},
        c = {},
        r = {},
        v = {},

        // list of system use properties in grp.
        sysProps = [
            "dest",
            "destTag",
            "usr",
            "contextmenu"
        ],

        /**
         * Send update data to the server
         * @method send
         * @paarm {String} df Design document function (ins/add/sav/del/tra)
         * @param {Object} data Data to send
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        send = function (df, name, data, suc, err) {
            var that = this;

            $.ajax({
                type: "POST",
                url: "/" + ext.def.project + "/_design/" + ext.def.fw + "/_update/" + df + "/" + name,

                data: data,

                timeout: ext.def.HTTP_TIMEOUT,

                success: function () {
                    if (suc) {
                        suc.apply(that, arguments);
                    }
                },
                error : function () {
                    if (err || suc) {
                        (err || suc).apply(that, arguments);
                    }
                }
            });

            return this;
        };



    // Model --------------------------------
    m[name] = Backbone.Model.extend({

        url: "/" + ext.def.project + "/" + ext.def.fw + "/" + name,

        //Backbone.Model.initialize
        initialize: function (opt, c) {
            opt = opt || {};

            if (!opt.guid) {
                opt.guid = ext.genGuid(this.name + "_");
            }

            // set default value to avoid unnecessary script error
            opt = _.extend({
                rotate: "",
                cls: ""
            }, opt);

            if (opt) {
                this.set(opt);
            }

            this.c = c || null;

            if (this.init) {
                this.init(opt);
            }
        },

        /**
         * Send insert data to the server
         * @method sendIns
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        sendIns: function (suc, err) {
            send.call(this, "ins", this.name, this.attributes, suc, err);
            return this;
        },

        /**
         * Send add data to the server
         * @method sendAdd
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        sendAdd: function (suc, err) {
            send.call(this, "add", this.name, this.attributes, suc, err);
            return this;
        },

        /**
         * Send add data to the server
         * @method sendSav
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        sendSav: function (suc, err) {
            send.call(this, "sav", this.name, this.attributes, suc, err);
            return this;
        },

        /**
         * Send delete data to the server
         * @method sendDel
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        sendDel: function (suc, err) {
            send.call(this, "del", this.name, this.attributes, suc, err);
            return this;
        },

        /**
         * Send transfer data to the server
         * @method sendTra
         * @param {String} to Destination grp
         * @param {Object} data Any extra data to send (optional)
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        sendTra: function (to, data, suc, err) {
            send.call(this, "tra", this.name, _.extend(data || {}, {
                guid: this.get("guid"),
                from: this.get("grp"),
                to: to
            }), suc, err);
            return this;
        },

        /**
         * Callback handler for data update
         * @method refresh
         * @param {Object}} data
         * @return {this}
         */
        refresh: function (data) {
            this.set(data);
            return this;
        },

        /**
         * Rotate option
         */
        rotate: function () {
            var rotate = Number(this.get("rotate")) + 90;
            if (rotate > 359) {
                rotate = rotate - 360;
            }

            this.set("rotate", rotate);
            this.sendSav();

            return rotate;
        },

        /**
         * show context menu
         */
        contextmenu: function (x, y) {
            var contextmenu = this.c.getContextMenu();
            contextmenu.set({
                hide: false,
                css_position: "absolute",
                css_px_top: y,
                css_px_left: x
            });
            contextmenu.lastModel = this;
        }
    });

    // Collection
    c[name] = Backbone.Collection.extend({
        initialize: function (models, grp) {
            // do not fix the model as context menu can be added to the collection.
            this.grp = grp || "data";
            this.constructor.children[this.name] = this.constructor.children[this.name] || {};
            this.constructor.children[this.name][this.grp] = this;
        },

        getContextMenu: function () {
            return this.filter(function (model) {
                return model.name === "Contextmenu";
            })[0];
        }

    }, {
        isMine: (function () {
            var rx = new RegExp("(^[^\$]+$)|(_\$[^.+]\$$)|(_\$" + ext.usr + ")$");
            
            return function () {
                return rx.test(arguments)
            }
        }()),

        /**
         * Send query to iterate and refresh all belonging models
         */
        refresh: function () {
            var c,
                That = this,
                name = this.prototype.name;

            $.couch.db(ext.def.project).openDoc(name, {
                success: function (res) {
                    var key, grpKey, rawGrpKey, bindedGrpKey,
                        modelKey, model, data, found, cssText, contextmenu, contextmenuData,
                        $layoutPos, $componentContainer;

                    // load css along with param stored in DB
                    if (That.css) {
                        cssText = ext.cssConverter(That.css(res), name);

                        ext.cssForge(cssText, name, {
                            loadThisCss: true
                        });

                        That.css = null;
                    }

                    // store definition to collection
                    // instead of simply add, extends the default_def
                    if (!That.def) {
                        That.def = {};
                    }
                    if (res.$_def) {
                        for (key in res.$_def) {
                            if (res.$_def.hasOwnProperty(key)) {
                                That.def[key] = _.extend(
                                    That.default_def || {},
                                    res.$_def[key]
                                );
                            }
                        }
                    }

                    // iteration for each group
                    for (grpKey in res) {
                        if (res.hasOwnProperty(grpKey)
                                && grpKey[0] !== "_"
                                && grpKey[0] !== "$"
                                && That.isMine(grpKey)) {

                            // grp key has several naming rule.
                            // treat them as A group.
                            data = res[grpKey];
                            // remove user
                            rawGrpKey = grpKey;

                            // if collection is not created, create it here now!
                            if (That.children[name]) {
                                c = That.children[name][rawGrpKey];
                            }
                            if (!c) {
                                c = new That([], rawGrpKey);

                                $layoutPos = $("#" + data.dest);
                                $componentContainer = $layoutPos.children("." + name);
                                if (!$componentContainer.length) {
                                    $componentContainer = $('<div class="' + name + '"></div>')
                                        .appendTo($layoutPos);
                                }

                                // $ (used for state) is prohibited to use for jQuery
                                c.$dest = $componentContainer.children("." + rawGrpKey.replace(/\$/g, ""));
                                if (!c.$dest || !c.$dest.length) {
                                    c.$dest = $('<' + (data.destTag || c.destTag || 'div') + ' class="' + rawGrpKey.replace(/\$/g, "") + '"></div>')
                                        .appendTo($componentContainer);
                                }
                            }

                            // to check if some models r deleted
                            found = [];


                            // first, prepare contextmenu as view will refer it
                            contextmenu = "";
                            contextmenuData = data.contextmenu || c.contextmenu;
                            if (contextmenuData) {
                                // add context menu only once
                                contextmenu = c.getContextMenu();
                                if (!contextmenu) {
                                    if (!contextmenuData.dest) {
                                        contextmenuData.dest = "body";
                                    }
                                    contextmenu = new ext.v.Contextmenu(contextmenuData, c).model;
                                    c.add(contextmenu);
                                }
                                found.push(contextmenu.get("guid"));
                                contextmenu = true;
                            }


                            // iteration for each data (models)
                            for (modelKey in data) {
                                if (data.hasOwnProperty(modelKey)
                                        && !_.contains(sysProps, modelKey)) {

                                    // let's have contextmenu parameter for later use
                                    if (data[modelKey].contextmenu === undefined) {
                                        data[modelKey].contextmenu = contextmenu;
                                    }

                                    // find a model it maybe exists
                                    model = c.find(function (model) {
                                        return model.get("guid") === modelKey;
                                    });

                                    if (model) {
                                        // model exists, refresh the information
                                        model.refresh(data[modelKey]);

                                    } else {
                                        // model does not exist, create new
                                        if (!That.def[name] && data.dest
                                                && (!(data.usr) || data.usr === ext.usr)) {

                                            model = (new ext.v[name](data[modelKey], c)).model;

                                        } else {
                                            // if dest is not defined, just create model instead of view with model
                                            model = new ext.m[name](data[modelKey], c);
                                        }
                                        model.set("grp", grpKey, {
                                            // silent to avoid view to re-render
                                            silent: true
                                        });
                                        c.add(model);
                                    }

                                    found.push(modelKey);
                                }
                            }


                            // delete one which is no longer exist
                            _.each(c.filter(function (model) {
                                // check if any model is deleted
                                return !_.find(found, function (guid) {
                                    return guid === model.get("guid");
                                });

                            }), function (model) {
                                // one which deleted
                                model.destroy();
                            });

                            if (c.afterRefresh) {
                                c.afterRefresh();
                            }

                        }
                    }
                }
            });
        },

        // internal use...
        children: {},

        /**
         * Send update data to the server
         * @method send
         * @paarm {String} df Design document function (ins/add/sav/del/tra)
         * @param {Object} data Data to send
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        send: function () {
            send.apply(this, arguments);
            return this;
        },

        /**
         * @method updateAll
         * @param {String} method Method to update the database (corresponding to the design document)
         * @param {String} grp Group to update.
         * @param {Object} vals Values to set to update (optional)
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for err (optional)
         * @return {this}
         */
        updateAll: function (method, grp, vals, suc, err) {
            var i, max,
                name = this.prototype.name,
                models = this.children[name][grp],
                data = {
                    grp: grp,
                    data: []
                };

            for (i = 0, max = models.length; i < max; i += 1) {
                if (vals) {
                    models.at(i).set(vals, { silent: true });
                }
                data.data.push(models.at(i).attributes);
            }

            send.call(this, method, name, data, suc, err);

            return this;
        },

        /**
         * Hide all belonging views
         * @method hide
         * @param {String} grp
         * @param {Function} suc
         * @param {Function} err
         * @return {this}
         */
        hide: function (grp, suc, err) {
            this.updateAll("savAll", grp, { "hide": true }, suc, err);
            return this;
        },

        /**
         * Show all belonging views
         * @method show
         * @param {String} grp
         * @param {Function} suc
         * @param {Function} err
         */
        show: function (grp, suc, err) {
            this.updateAll("savAll", grp, { "hide": "" }, suc, err);
            return this;
        }
    });

    // View --------------------------------
    v[name] = Backbone.View.extend({
        // template must be overridden
        template: "",

        model: null,

        // default data for rendering the template
        // override this each component implementation.
        defData: {},

        // common html definition
        id: function () {
            return this.options.guid;
        },
        className: function () {
            return "component";
        },

        //common functionality
        initialize: function (opt, c) {
            var that = this;

            // bind model to the view
            if (opt instanceof Backbone.Model) {
                this.model = opt;

            } else {
                this.model = new ext.m[this.name](opt, c);
            }

            if (this.init) {
                this.init(opt);
            }

            this.render(this.model.attributes, {
                noAnim: true
            });

            // appends only once
            if (!opt.dest) {
                c.$dest.append(this.$el);

            } else {
                $(opt.dest).append(this.$el);
            }

            this.model.bind("change", function (model) {
                that.render(model.attributes);
            });

            this.model.bind("destroy", function () {
                that.remove();
            });

            //initialize options before view is being instanced
            this.initOpt();
        },

        /**
         * Override function of Backbone.View.render
         * @method render
         * @param {Object} data Data to use render. Use model attribute if no data is given. (optional)
         * @param {Object} opt Option value (optional)
         * @return {this}
         */
        render: function (data, opt) {
            if (!data) {
                data = this.model.attributes || {};
            }

            if (!data.guid) {
                data.guid = this.model.get("guid");
            }

            if (this.model.get("hide")) {
                this.$el.hide();
            } else {
                this.$el.show();
            }

            this.$el.html(this.template(_.extend(this.defData, data)));

            if (opt && opt.noAnim
                    || this.noAnim) {
                this.updateStyle(true);
            } else {
                this.updateStyle(false);
            }

            if (this.afterRender) {
                this.afterRender(opt);
            }

            return this;
        },

        /**
         * Reset styles according to the properties on model
         * @method updateStyle
         * @param anim {Boolean} If do animation
         * @return this
         */
        updateStyle: function (noAnim) {
            var css = {},
                attrs = this.model.attributes,
                keys = _.keys(attrs),
                styleKeys = _.filter(keys, function (key) {
                    return (/^css_/).test(key);
                }),
                pxSuffixKeys = _.filter(keys, function (key) {
                    return (/_px_/).test(key);
                });

            _.each(styleKeys, function (key) {
                var cssKey = key.replace(/^css_/, "");
                cssKey = cssKey.replace(/^px_/, "");

                css[cssKey] = attrs[key];
                if (_.contains(pxSuffixKeys, key)) {
                    css[cssKey] += "px";
                }
            });

            if (noAnim) {
                this.$el.css(css);
            } else {
                this.$el.animate(css);
            }

            return this;
        },

        // Initialize each options
        initOpt: function () {
            this.events = this.events || {};

            if (this.model.get("contextmenu")
                    || this.model.get("rotate")) {

                this.events.mousedown = "mousedown";
            }

            if (this.model.get("draggable")) {
                this.dndHandle(this.$el);
            }

            this.delegateEvents();
        },

        //mousedown handler
        mousedown: function (e) {
            if (e.which === 3) {
                //right click
                if (this.model.get("contextmenu")) {
                    this.model.contextmenu(e.clientX, e.clientY);

                } else if (this.model.get("rotate")) {
                    this.model.rotate();
                }

                e.preventDefault();
                return false;
            }
        },

        //drag and drop handler
        dndHandle: function ($el) {
            var that = this;

            // enable drag and drop
            $el.draggable()
                .css("position", "absolute")
                .addClass("draggable")
                .bind("dragstop", function (e, ui) {
                    that.model.set({
                        css_px_top: ui.position.top,
                        css_px_left: ui.position.left
                    });
                    that.model.sendSav();
                });
        }
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

}, {
    loadCssImmediate: true
});
