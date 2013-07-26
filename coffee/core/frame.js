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

        $center,
        $header,
        $left,
        $left_proxy,
        $right,
        $right_proxy,
        $footer,

        adjustMargin = function (width, height) {
            if (!width) {
                width = ext.w.innerWidth;
            }
            if (!height) {
                height = ext.w.innerHeight;
            }

            $center.css({
                height: height - (48 * 2) + "px",
                width: width - (48 * 2) + "px",
                margin: "48px",
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
                if (args.relatedTarget !== this
                        && !$(args.relatedTarget).parents("#" + this.id).length) {

                    $left.fadeOut(200);
                }
            });
            $left.hide();

            // right
            $right_proxy.bind("mouseover", function () {
                $right.fadeIn(200);
            });
            $right.bind("mouseout", function (args) {
                if (args.relatedTarget !== this
                        && !$(args.relatedTarget).parents("#" + this.id).length) {

                    $right.fadeOut(200);
                }
            });
            $right.hide();

            // header
            $header.bind("mouseover", function () {
                $(this).fadeTo(200, 1);
            });
            $header.bind("mouseout", function (args) {
                if (args.relatedTarget !== this
                        && !$(args.relatedTarget).parents("#" + this.id).length) {

                    $header.fadeTo(200, 0.5);
                }
            });
            $header.fadeTo(200, 0.5);

            // footer
            $footer.bind("mouseover", function () {
                $(this).fadeTo(200, 1);
            });
            $footer.bind("mouseout", function (args) {
                if (args.relatedTarget !== this
                        && !$(args.relatedTarget).parents("#" + this.id).length) {

                    $footer.fadeTo(200, 0.5);
                }
            });
            $footer.fadeTo(200, 0.5);

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
        }
    });

    // View
    v[name] = Backbone.View.extend({
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
        }
    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };

}, { loadCssImmediate: true });
