/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

/**
 * @module Component
 * @namespace coffee
 */

coffee.include("Component", "components.html", [], function (name, ext) {
    "use strict";

    var _ = ext._,
        $ = ext.$,
        Backbone = ext.Backbone,
        w = ext.w,

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
         * @method genNewGrpStr
         * @param {String} grp
         * @param {Object} param
         * @private
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
     * @class m.Component
     * @submodule Backbone.Model
     * @constructor
     */
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
         * @param {Object} data (optional)
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        sendIns: function (data, suc, err) {
            if (!data) {
                data = {};
            } else {
                data = _.extend({}, data);
            }
            data = _.extend(_.extend({}, this.attributes), data);

            ext.send.call(this, "ins", this.name, data, suc, err);
            return this;
        },

        /**
         * Send save data to the server
         * @method sendSav
         * @param {Object} data (optional)
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        sendSav: function (data, suc, err) {
            if (!data) {
                data = {};
            } else {
                data = _.extend({}, data);
            }
            data = _.extend(_.extend({}, this.attributes), data);

            ext.send.call(this, "sav", this.name, data, suc, err);
            return this;
        },

        /**
         * Send clone data to the server
         * @method sendClo
         * @param {Object} data (optional)
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        sendClo: function (data, suc, err) {
            if (!data) {
                data = {};
            } else {
                data = _.extend({}, data);
            }
            data = _.extend(_.extend({}, this.attributes), data);

            // replace guid to clone the data
            data.guid = this.name + "_" + ext.genGuid();

            ext.send.call(this, "sav", this.name, data, suc, err);
            return this;
        },

        /**
         * Send delete data to the server
         * @method sendDel
         * @param {Object} data
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        sendDel: function (data, suc, err) {
            if (!data) {
                data = {};
            } else {
                data = _.extend({}, data);
            }
            data = _.extend(_.extend({}, this.attributes), data);

            ext.send.call(this, "del", this.name, data, suc, err);
            return this;
        },

        /**
         * Send transfer data to the server
         * @method sendTra
         * @param {Object} data (optional)
         * <ul>
         * <li>{String}to: Destination grp.</li>
         * <li>{Strin}override: Override data.</li>
         * </ul>
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         */
        sendTra: function (data, suc, err) {
            if (!data) {
                data = {};
            } else {
                data = _.extend({}, data);
            }
            data = _.extend(_.extend({}, this.attributes), data);

            data.from = this.get("grp");

            ext.send.call(this, "tra", this.name, data, suc, err);
            return this;
        },

        /**
         * Clone and transfer
         * @method sendCloTra
         * @param {Object} data Optional data.
         * <ul>
         * <li>{String}to: Destination grp (optional) draw to ur hand if not specified.</li>
         * <li>{Boolean}play: If it to play.</li>
         * </ul>
         * @param {Function} suc
         * @param {Function} err
         * @return {this}
         */
        sendCloTra: function (data, suc, err) {
            var centerPos;

            if (!data) {
                data = {};
            } else {
                data = _.extend({}, data);
            }
            data = _.extend(_.extend({}, this.attributes), data);

            data.guid = this.name + "_" + ext.genGuid();

            if (data.play) {
                centerPos = ext.c.Frame.getCenterCoordinate({
                    height: this.view.$el.height(),
                    width: this.view.$el.width()
                });

                _.extend(data, {
                    draggable: true,
                    css_px_left: centerPos.x,
                    css_px_top: centerPos.y
                });
            }

            ext.send.call(this, "sav", this.name, data, suc, err);

            return this;
        },

        /**
         * Callback handler for data update
         * @method refresh
         * @param {Object} data
         * @return {this}
         */
        refresh: function (data) {
            this.set(data);
            return this;
        },

        /**
         * Rotate 90 degree to the right
         * @method rotate
         * @return {Number} new degree
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
         * Show context menu
         * @method contextmenu
         * @param {Number} x
         * @param {Number} y
         */
        contextmenu: function (x, y) {
            var contextmenu = this.c.getContextMenu();
            contextmenu.set({
                hide: false,
                css_position: "absolute",
                css_px_top: y - 2,
                css_px_left: x - 2
            });
            contextmenu.lastModel = this;
        }
    });


    /**
     * Collection
     * @class c.Component
     * @submodule Backbone.Collection
     * @constructor
     */
    c[name] = Backbone.Collection.extend({
        initialize: function (models, grp) {
            // do not fix the model as context menu can be added to the collection.
            this.grp = grp || "data";
            this.constructor.children[this.name] = this.constructor.children[this.name] || {};
            this.constructor.children[this.name][this.grp] = this;
        },

        /**
         * Get corresponding context menu
         * @method getContextMenu
         * @return {Object}
         */
        getContextMenu: function () {
            return this.filter(function (model) {
                return model.name === "Contextmenu";
            })[0];
        }

    }, {
        /**
         * Check if the given group name is yours.
         * @method isMine
         * @param {String} str Group name to be checked.
         * @requires {Boolean}
         * @static
         */
        isMine: (function () {
            var rx;

            return function (str) {
                if (!rx) {
                    // make delay for ext.usr to be defined
                    rx = new RegExp("(^[^\\$]+$)|(_\\$[^_]+\\$$)|(_\\$" + ext.usr + ")$");
                }
                return rx.test(str);
            };
        }()),

        /**
         * Send query to iterate and refresh all belonging models
         * @method refresh
         * @static
         */
        refresh: function () {
            var c,
                That = this,
                name = this.prototype.name;

            $.couch.db(ext.def.project).openDoc(name, {
                success: function (res) {
                    var i, max,
                        key, grpKey, rawGrpKey,
                        model, data, found, cssText, contextmenu, contextmenuData,
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
                                        contextmenuData.dest = "#Contextmenu";
                                    }
                                    if (!contextmenuData.guid) {
                                        contextmenuData.guid = "Contextmenu_" + ext.genGuid();
                                    }
                                    contextmenu = new ext.v.Contextmenu(contextmenuData, c).model;
                                    c.add(contextmenu);
                                }
                                found.push(contextmenu.get("guid"));
                                contextmenu = true;
                            }


                            // iteration for each data (models)
                            if (!data.data) {
                                data.data = [];
                            }
                            for (i = 0, max = data.data.length; i < max; i += 1) {

                                // let's have contextmenu parameter for later use
                                if (data.data[i].contextmenu === undefined) {
                                    data.data[i].contextmenu = contextmenu;
                                }

                                // find a model it maybe exists
                                model = c.find(function (model) {
                                    return model.get("guid") === data.data[i].guid;
                                });

                                if (model) {
                                    // model exists, refresh the information
                                    model.refresh(data.data[i]);

                                } else {
                                    // model does not exist, create new
                                    if (!That.def[name] && data.dest
                                            && (!(data.usr) || data.usr === ext.usr)) {

                                        model = (new ext.v[name](data.data[i], c)).model;

                                    } else {
                                        // if dest is not defined, just create model instead of view with model
                                        model = new ext.m[name](data.data[i], c);
                                    }
                                    model.set("grp", grpKey, {
                                        // silent to avoid view to re-render
                                        silent: true
                                    });
                                    c.add(model);
                                }

                                found.push(model.get("guid"));
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
         * @param {String} df Design document function (ins/add/sav/del/tra)
         * @param {Object} data Data to send
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         * @static
         */
        send: function () {
            ext.send.apply(this, arguments);
            return this;
        },

        /**
         * Send shuffle request to the server
         * @method sendShu
         * @param {String} grp Group name
         * @param {Object} data override data
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         * @static
         */
        sendShu: function (grp, data, suc, err) {
            if (!data) {
                data = {};
            } else {
                data = _.extend({}, data);
            }

            _.extend(data, {
                grp: grp
            });

            ext.send.call(this, "shu", this.prototype.name, {
                grp: grp
            }, suc, err);

            return this;
        },

        /**
         * take
         * @method take
         * @param {String} grp
         * @param {Object} data (optional)
         * <ul>
         * <li>to: destination (optional) Draw to ur hand if not specified.</li>
         * <li>idx: index of the card (optional) Draw from the top if not specified.</li>
         * </ul>
         * @param {Function} suc (optional)
         * @param {Function} err (optional)
         * @return {this}
         * @static
         */
        sendTake: function (grp, data, suc, err) {
            var centerPos;

            if (!data) {
                data = {};
            } else {
                data = _.extend({}, data);
            }

            data.from = grp;

            if (!data.to) {
                data.to = genNewGrpStr(grp, {
                    usr: ext.usr
                });
                data.dest = "footer";
            }

            if (data.from === data.to) {
                // this can delete the data
                return this;
            }

            if (data.play) {
                if (!data.override) {
                    data.override = {};
                }
                data.override.draggable = true;
            }

            if (data.idx === undefined) {
                data.idx = 0;
            }

            ext.send.call(this, "tra", this.prototype.name, data, suc, err);

            return this;
        },

        /**
         * Transfer multiple targes
         * @method sendTraAll
         * @param {String} grp
         * @param {Object} data (optional)
         * <ul>
         * <li>{String}to: Destination grp.</li>
         * <li>{String}dest: Destination element ID to override (optional)</li>
         * <li>{String[]}guids: List of target GUID (optional) transfer all if not specified.</li>
         * <li>{Object}override: Override data (optional)</li>
         * </ul>
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         * @static
         */
        sendTraAll: function (grp, data, suc, err) {
            if (!data) {
                data = {};
            } else {
                data = _.extend({}, data);
            }
            data.from = grp;

            if (!data.to) {
                // this arguemnt is must
                return this;
            }

            ext.send.call(this, "traAll", this.prototype.name, data, suc, err);

            return this;
        },

        /**
         * Transfer back all suffixed grp
         * @method sendTraBac
         * @param {String} grp
         * @param {String} data (optional)
         * <ul>
         * <li>{Object}override: override data (optional)</li>
         * </ul>
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         * @static
         */
        sendTraBac: function (grp, data, suc, err) {
            if (!data) {
                data = {};
            } else {
                data = _.extend({}, data);
            }
            data.grp = grp;

            ext.send.call(this, "traBac", this.prototype.name, data, suc, err);

            return this;
        },

        /**
         * Reset data to templates
         * @method sendResTem
         * @param {String} grp
         * @param {Object} data
         * @param {Function} suc Callback for success (optional)
         * @param {Function} err Callback for error (optional)
         * @return {this}
         * @static
         */
        sendResTem: function (grp, data, suc, err) {
            if (!data) {
                data = {};
            } else {
                data = _.extend({}, data);
            }
            data.grp = grp;

            ext.send.call(this, "resTem", this.prototype.name, data, suc, err);
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
         * @static
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

            ext.send.call(this, method, name, data, suc, err);

            return this;
        },

        /**
         * Hide all belonging views
         * @method hide
         * @param {String} grp
         * @param {Function} suc
         * @param {Function} err
         * @return {this}
         * @static
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
         * @return {this}
         * @static
         */
        show: function (grp, suc, err) {
            this.updateAll("savAll", grp, { "hide": "" }, suc, err);
            return this;
        }
    });


    /**
     * View
     * @class v.Component
     * @submodule Backbone.View
     * @constructor
     */
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
                this.model.view = this;

            } else {
                this.model = new ext.m[this.name](opt, c);
                this.model.view = this;
            }

            if (this.init) {
                this.init(opt);
            }

            this.render(this.model.attributes, {
                noAnim: true
            });

            // appends only once
            this.$el.hide();
            if (!opt.dest) {
                c.$dest.append(this.$el);

            } else {
                $(opt.dest).append(this.$el);
            }
            this.$el.fadeIn(100);

            this.model.bind("change", function (model) {
                that.render(model.attributes);
            });

            this.model.bind("destroy", function () {
                that.remove();
                that.model = null;
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

            this.$el.html(this.template(_.extend(_.extend({}, this.defData), data)));

            if ((opt && opt.noAnim) || this.noAnim) {
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
         * @param noAnim {Boolean} If do animation
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

            if (this.model.get("rotate")) {
                this.events.mouseup = "mouseup";
            }

            if (this.model.get("draggable")) {
                this.dndHandle(this.$el);
            }

            this.delegateEvents();
        },

        mouseup: function (e) {
            if (e.which === 1) {
                if (w.Number(new w.Date()) - this.model.mousedownAt < 200) {
                    this.model.rotate();
                }
            }
        },

        // mousedown handler
        mousedown: function (e) {
            if (e.which === 1) {
                // left click
                if (this.model.get("rotate")) {
                    // rotate if it mouse up within 200ms
                    this.model.mousedownAt = w.Number(new w.Date());
                }
            }

            if (e.which === 3) {
                // right click
                if (this.model.get("contextmenu")) {
                    this.model.contextmenu(e.clientX, e.clientY);
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
