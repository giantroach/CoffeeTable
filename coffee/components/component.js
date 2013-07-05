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
        v = {};


    // Model --------------------------------
    m[name] = Backbone.Model.extend({

        url: "/" + ext.def.project + "/" + ext.def.fw + "/" + name,

        //Backbone.Model.initialize
        initialize: function (opt) {
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

            if (this.init) {
                this.init(opt);
            }
        },

        /**
         * Send update data to the server
         * @method send
         * @paarm {String} df Design document function (ins/add/sav/del)
         * @param {Object} data Data to send
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        send: function (df, data, suc, err) {
            var that = this;

            $.ajax({
                type: "POST",
                url: "/" + ext.def.project + "/_design/" + ext.def.fw + "/_update/" + df + "/" + this.name,

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
        },

        /**
         * Send insert data to the server
         * @method sendIns
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        sendIns: function (suc, err) {
            this.send("ins", this.attributes, suc, err);
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
            this.send("add", this.attributes, suc, err);
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
            this.send("sav", this.attributes, suc, err);
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
            this.send("del", this.attributes, suc, err);
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
        }
    });

    // Collection
    c[name] = Backbone.Collection.extend({

        initialize: function (models, grp) {
            this.model = ext.m[this.name];
            this.grp = grp || "data";
            this.constructor.children[this.name] = this.constructor.children[this.name] || {};
            this.constructor.children[this.name][this.grp] = this;
        }

    }, {
        /**
         * Send query to iterate and refresh all belonging models
         */
        refresh: function () {
            var c,
                That = this,
                name = this.prototype.name;

            $.couch.db(ext.def.project).openDoc(name, {
                success: function (res) {
                    var grpKey, modelKey, model, data, found, cssText,
                        $layoutPos, $componentContainer;

                    // load css along with param stored in DB
                    if (That.css) {
                        cssText = ext.cssConverter(That.css(res), name);

                        ext.cssForge(cssText, name, {
                            loadThisCss: true
                        });

                        That.css = null;
                    }

                    // iteration for each group
                    for (grpKey in res) {
                        if (res.hasOwnProperty(grpKey)
                                && grpKey[0] !== "_"
                                && grpKey[0] !== "$") {

                            data = res[grpKey];

                            // if collection is not created, create it here now!
                            if (That.children[name]) {
                                c = That.children[name][grpKey];
                            }
                            if (!c) {
                                c = new That([], grpKey);

                                $layoutPos = $("#" + data.dest);
                                $componentContainer = $layoutPos.children("." + name);
                                if (!$componentContainer.length) {
                                    $componentContainer = $('<div class="' + name + '"></div>')
                                        .appendTo($layoutPos);
                                }

                                c.$dest = $componentContainer.children("." + grpKey);
                                if (!c.$dest || !c.$dest.length) {
                                    c.$dest = $('<' + (data.destTag || 'div') + ' class="' + grpKey + '"></div>')
                                        .appendTo($componentContainer);
                                }
                            }

                            // to check if some models r deleted
                            found = [];

                            // iteration for each data (models)
                            for (modelKey in data) {
                                if (data.hasOwnProperty(modelKey)
                                        && modelKey !== "dest"
                                        && modelKey !== "destTag") {

                                    model = c.find(function (model) {
                                        return model.get("guid") === modelKey;
                                    });

                                    if (model) {
                                        // model exists, refresh the information
                                        model.refresh(data[modelKey]);

                                    } else {
                                        // model does not exist, create new
                                        model = (new ext.v[c.name](data[modelKey], c)).model;
                                        model.set("grp", grpKey);
                                        c.add(model);
                                    }

                                    found.push(modelKey);
                                }
                            }

                            _.each(c.filter(function (model) {
                                // check if any model is deleted
                                return !_.find(found, function (guid) {
                                    return guid === model.get("guid");
                                });

                            }), function (model) {
                                // one which deleted
                                model.destroy();
                            });

                        }
                    }

                    // store definition to collection
                    That.def = res.$_def || {};
                }
            });
        },

        children: {}
    });

    // View --------------------------------
    v[name] = Backbone.View.extend({
        // template must be overridden
        template: "",

        model: null,

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
                this.model = new ext.m[this.name](opt);
            }

            if (this.init) {
                this.init(opt);
            }

            this.render(this.model.attributes, {
                noAnim: true
            });

            // appends only once
            c.$dest.append(this.$el);

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

            // TODO:there must be other than replacing option
            this.$el.html(this.template(data));

            if (opt && opt.noAnim) {
                this.updateStyle(true);
            } else {
                this.updateStyle(false);
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
                var cssKey = key.replace(/(^css)|(_px_)/g, "");

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

            if (this.model.get("rotate")) {
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
                this.model.rotate();
                e.preventDefault();
                return false;
            }
        },

        //drag and drop handler
        dndHandle: function ($el) {
            var that = this;

            // enable drag and drop
            $el.draggable()
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
