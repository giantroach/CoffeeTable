/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

coffee.include("Frame", "../core/frame.html", ["Component"], function (name, ext) {
    "use strict";

    var $ = ext.$,
        Backbone = ext.Backbone,

        m = {},
        c = {},
        r = {},
        v = {},

        left_pin = "off",
        right_pin = "off",

        $center,
        $header,
        $left,
        $left_proxy,
        $right,
        $right_proxy,
        $footer,

        adjustMargin = function (width, height) {
            var leftMargin, rightMargin;
            
            if (!width) {
                width = ext.w.innerWidth;
            }
            if (!height) {
                height = ext.w.innerHeight;
            }
            if (left_pin === "on") {
                leftMargin = 192;
            } else {
                leftMargin = 48;
            }
            if (right_pin === "on") {
                rightMargin = 192;
            } else {
                rightMargin = 48;
            }

            $center.css({
                height: height - (48 * 2) + "px",
                width: width - (leftMargin + rightMargin) + "px",
                margin: "48px " + rightMargin + "px 48px " + leftMargin + "px",
                overflow: "auto"
            });

            $left.css({
                height: height - (48 * 2) + "px",
                margin: "48px 0"
            });
            $left_proxy.css({
                height: height - (48 * 2) + "px",
                margin: "48px 0"
            });
            $right.css({
                height: height - (48 * 2) + "px",
                margin: "48px 0"
            });
            $right_proxy.css({
                height: height - (48 * 2) + "px",
                margin: "48px 0"
            });
        },

        startResizeHandling = function () {
            var underFooterAnimate = false;
            
            $center = $("#center");
            $header = $("#header");
            $left = $("#left");
            $left_proxy = $("#left_proxy");
            $right = $("#right");
            $right_proxy = $("#right_proxy");
            $footer = $("#footer");

            // left
            $left_proxy.bind("mouseover", function () {
                $left.fadeIn(200);
            });
            $left.bind("mouseout", function (args) {
                if (left_pin === "off"
                        && args.relatedTarget !== this
                        && !$(args.relatedTarget).parents("#" + this.id).length
                        && !(args.relatedTarget && args.relatedTarget.id && /^Contextmenu_/.test(args.relatedTarget.id))) {

                    $left.fadeOut(200);
                }
            });
            $left.hide();

            // right
            $right_proxy.bind("mouseover", function () {
                $right.fadeIn(200);
            });
            $right.bind("mouseout", function (args) {
                if (right_pin === "off"
                        && args.relatedTarget !== this
                        && !$(args.relatedTarget).parents("#" + this.id).length
                        && !(args.relatedTarget && args.relatedTarget.id && /^Contextmenu_/.test(args.relatedTarget.id))) {

                    $right.fadeOut(200);
                }
            });
            $right.hide();

            // header
            // none

            // footer
            $footer.bind("mouseover", function (args) {
                if (underFooterAnimate) {
                    return;
                }

                underFooterAnimate = true;
                $footer.animate({
                    height: "256px"
                }, 100, function () {
                    underFooterAnimate = false;
                });
            });
            $footer.bind("mouseout", function (args) {
                if (underFooterAnimate
                    || $(args.relatedTarget).parents("#footer").length
                    || args.relatedTarget && args.relatedTarget.id && /^Contextmenu_/.test(args.relatedTarget.id)) {

                    return;
                }

                underFooterAnimate = true;
                $footer.animate({
                    height: "48px"
                }, 100, function () {
                    underFooterAnimate = false;
                });
            });
            ext.onResize(adjustMargin);
            adjustMargin();
        };


    /**
     * Model
     */
    m[name] = Backbone.Model.extend({
    });

    // Collection
    c[name] = Backbone.Collection.extend({
        $dest: $("body")
    }, {
        setup: function (callback) {
            var col = new this(),
                mod = (new ext.v[name]({}, col)).model;

            col.add(mod);
            callback();
        },

        /**
         * @method getWinsize
         * @param {Object}} box Boxed object size (optional)
         * @return {Object} 
         */
        getCenterCoordinate: function (box) {
            var width, height;
            
            if (!box) {
                box = {
                    width: 0,
                    height: 0
                };
            }

            // width
            return {
                x: ext.w.parseInt(($center.width() / 2) + $center.scrollLeft() - (box.width / 2), 10),
                y: ext.w.parseInt(($center.height() / 2) + $center.scrollTop() - (box.height / 2), 10)
            };
        }
    });

    // View
    v[name] = Backbone.View.extend({
        events: {
            "click": "click"
        },

        initialize: function (opt, c) {
            var that = this;

            // bind model to the view
            this.model = new ext.m[name](opt);

            this.render();

            // appends only once
            c.$dest.prepend(this.$el);

            // destroy
            this.model.bind("destroy", function () {
                that.remove();
            });

            // event handlers
            startResizeHandling();
        },

        render: function () {
            this.$el = $(this.template());
        },

        click: function (args) {
            if (args.target.id === "left_pin") {
                if (left_pin === "off") {
                    left_pin = "on";
                    $(args.target).removeClass("pin_off").addClass("pin_on");
                    adjustMargin();
                    return;
                }

                left_pin = "off";
                $(args.target).removeClass("pin_on").addClass("pin_off");
                adjustMargin();
                return;
            }

            if (args.target.id === "right_pin") {
                if (right_pin === "off") {
                    right_pin = "on";
                    $(args.target).removeClass("pin_off").addClass("pin_on");
                    adjustMargin();
                    return;
                }

                right_pin = "off";
                $(args.target).removeClass("pin_on").addClass("pin_off");
                adjustMargin();
                return;
            }
        }
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

}, { loadCssImmediate: true });
