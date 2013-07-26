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
        $right,
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
            $right.css({
                height: height - (48 * 2) + "px",
                margin: "48px 0"
            });
        },

        startResizeHandling = function () {
            var targets = ["header", "left", "right", "footer"],
                $targets;

            $center = $("#center");
            $header = $("#header");
            $left = $("#left");
            $right = $("#right");
            $footer = $("#footer");

            $targets = {
                header: $header,
                left: $left,
                right: $right,
                footer: $footer
            };

            _.each($targets, function ($target) {
                $target.bind("mouseover", function () {
                    $(this).fadeTo(200, 1);
                    _.each(_.omit($targets, this.id), function ($target) {
                        $target.fadeTo(200, 0.25);
                    });
                });
                $target.bind("mouseout", function (args) {
                    if (args.relatedTarget !== this
                            && !$(args.relatedTarget).parents("#" + this.id).length) {

                        $target.fadeTo(200, 0.25);
                    }
                });

                $target.fadeTo(200, 0.25);
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
            var c = new this(),
                m = (new ext.v[name]({}, c)).model;

            c.add(m);
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
