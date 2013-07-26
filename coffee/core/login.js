/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

coffee.include("Login", "../core/login.html", [], function (name, ext) {
    "use strict";

    var $ = ext.$,
        Backbone = ext.Backbone,

        m = {},
        c = {},
        r = {},
        v = {};


    /**
     * Model
     */
    m[name] = Backbone.Model.extend({
    });

    // Collection
    c[name] = Backbone.Collection.extend({
        $dest: $("body")
    }, {

        //start
        start: function (callback) {
            var c = new this(),
                m = (new ext.v[name]({}, c)).model;

            m.set("callback", callback)

            c.add(m);
        }

    });

    // View
    v[name] = Backbone.View.extend({
        initialize: function (opt, c) {
            var that = this;

            // bind model to the view
            this.model = new ext.m[this.name](opt);

            this.render();

            // appends only once
            c.$dest.append(this.$el);

            // show login dialog
            $("#login_dialog").dialog({
                modal: true,
                closeOnEscape: false,
                resizable: false,
                open: function () {
                    $(".ui-dialog-titlebar-close").hide();
                },
                buttons: {
                    Done: function () {
                        if ($("#usr_name").val()) {
                            //TODO: log this login here
                            ext.usr = $("#usr_name").val();
                            $(this).dialog("close");
                            that.model.get("callback")();
                            that.model.destroy();

                        } else {
                            alert("Enter ur fuckin name idiot!");
                        }
                    }
                }
            });

            // destroy
            this.model.bind("destroy", function () {
                that.remove();
            });
        },

        render: function () {
            this.$el.html(this.template());
        }

    });


    return {
        m : m[name],
        c : c[name],
        r : r[name],
        v : v[name]
    };
});
