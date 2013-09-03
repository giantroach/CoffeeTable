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
        $left_fold,
        $right,
        $right_fold,
        $footer,

        adjustMargin = function (width, height) {
            var leftMargin, rightMargin, headerPaddingLeft, headerPaddingRight;

            if (!width) {
                width = ext.w.innerWidth;
            }
            if (!height) {
                height = ext.w.innerHeight;
            }
            if (left_pin === "on") {
                leftMargin = 256;
                headerPaddingLeft = 256;
            } else {
                leftMargin = 48;
                headerPaddingLeft = 48;
            }
            if (right_pin === "on") {
                rightMargin = 256;
                headerPaddingRight = 256;
            } else {
                rightMargin = 48;
                headerPaddingRight = 48;
            }

            $center.css({
                height: height - (64 + 48) + "px",
                width: width - (leftMargin + rightMargin) + "px",
                margin: "64px " + rightMargin + "px 48px " + leftMargin + "px",
                overflow: "auto"
            });

            $header.css({
                paddingRight: headerPaddingRight + "px",
                paddingLeft: headerPaddingLeft + "px"
            });

            $left.css({
                height: height - (64 + 48) + "px",
                marginTop: "64px",
                marginBottom: "48px"
            });
            $right.css({
                height: height - (64 + 48) + "px",
                marginTop: "64px",
                marginBottom: "48px"
            });
        },

        startResizeHandling = function () {
            var underFooterAnim = false,
                underLeftAnim = false,
                underRightAnim = false;

            $center = $("#center");
            $header = $("#header");
            $left = $("#left");
            $left_fold = $("#left_fold");
            $right = $("#right");
            $right_fold = $("#right_fold");
            $footer = $("#footer");

            // left
            $left_fold.bind("click", function () {
                if (underLeftAnim || left_pin === "on") {
                    return;
                }

                if ($left_fold.is(".fold_to_right")) {
                    // expand
                    underLeftAnim = true;
                    $left.animate({
                        marginLeft: "0px"
                    }, 100, null, function () {
                        underLeftAnim = false;
                        $left_fold
                            .removeClass("fold_to_right")
                            .addClass("fold_to_left");
                    });

                } else {
                    // fold
                    underLeftAnim = true;
                    $left.animate({
                        width: "256px",
                        marginLeft: "-208px"
                    }, 100, null, function () {
                        underLeftAnim = false;
                        $left_fold
                            .removeClass("fold_to_left")
                            .addClass("fold_to_right");
                    });
                }
            });

            // right
            $right_fold.bind("click", function () {
                if (underRightAnim || right_pin === "on") {
                    return;
                }

                if ($right_fold.is(".fold_to_left")) {
                    // expand
                    underRightAnim = true;
                    $right.animate({
                        marginRight: "0px"
                    }, 100, null, function () {
                        underRightAnim = false;
                        $right_fold
                            .removeClass("fold_to_left")
                            .addClass("fold_to_right");
                    });

                } else {
                    // fold
                    underRightAnim = true;
                    $right.animate({
                        width: "256px",
                        marginRight: "-208px"
                    }, 100, null, function () {
                        underRightAnim = false;
                        $right_fold
                            .removeClass("fold_to_right")
                            .addClass("fold_to_left");
                    });
                }
            });

            // header
            // none

            // footer
            $footer.bind("mouseover", function (args) {
                if (underFooterAnim || $footer.css("height") === "256px") {
                    return;
                }

                underFooterAnim = true;
                $footer.animate({
                    height: "256px"
                }, 100, function () {
                    underFooterAnim = false;
                });
            });
            $footer.bind("mouseout", function (args) {
                if (underFooterAnim
                        || $(args.relatedTarget).parents("#footer").length
                        || (args.relatedTarget
                                && (args.relatedTarget.id
                                        && (args.relatedTarget.id === "footer")
                                                || /^Contextmenu_/.test(args.relatedTarget.id))
                                || $(args.relatedTarget).parents("#Contextmenu").length)) {

                    return;
                }

                underFooterAnim = true;
                $footer.animate({
                    height: "48px"
                }, 100, function () {
                    underFooterAnim = false;
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
