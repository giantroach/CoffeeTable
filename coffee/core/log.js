/*jslint browser: true, nomen: true, indent: 4 */
/*global coffee */

coffee.include("Log", "../core/log.html", [], function (name, ext) {
    "use strict";

    var $ = ext.$,
        Backbone = ext.Backbone,

        m = {},
        c = {},
        r = {},
        v = {},

        w = ext.w,

        $logTbody = null,
        lastTm = 0,

        forceWw = function (str) {
            var i, max,
                tmpAry = [];
            for (i = 0, max = str.length; i < max; i += 1) {
                tmpAry.push(str[i]);
            }
            return tmpAry.join("&#x200B;");
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
            $logTbody = $("#log_tbl tbody");
            if (callback) {
                callback();
            }
        },


        //callback for doc update
        refresh: function () {
            $.couch.db(ext.def.project).openDoc(name, {
                success: function (res) {
                    //refresh
                    var i, max, tm,
                        data = res.data ? (res.data.data || []) : [],

                        getIntTm = function (str) {
                            return w.Number(new w.Date(str));
                        },

                        getTmStr = function (dtStr) {
                            var oDt = new w.Date(dtStr),
                                hou = oDt.getHours(),
                                min = oDt.getMinutes(),
                                sec = oDt.getSeconds();

                            return hou + ":" + min + ":" + sec;
                        };

                    if (!data.length) {
                        return;
                    }

                    // first, find where from to append
                    for (i = data.length - 1; 0 <= i; i -= 1) {
                        tm = getIntTm(data[i].tm);
                        if (tm <= lastTm) {
                            break;
                        }
                    }

                    // append logs
                    for (i += 1, max = data.length; i < max; i += 1) {
                        $logTbody.append(
                            '<tr class="' + (data[i].type || "") + '">'
                                + '<td class="nm">[' + (data[i].nm || "") + ']</td>'
                                + '<td class="text">' + forceWw(data[i].text || "") + ' (' + getTmStr(data[i].tm) + ')' + '</td>'
                                + '</tr>'
                        );
                    }

                    $("#log_wrap_tbl").scrollTop($logTbody.height())

                    lastTm = getIntTm(data[data.length - 1].tm);
                }
            });

            return this;
        },


        /**
         * @method send
         * @param {Object} obj
         * <ul>
         * <li>text: to send (optional)</li>
         * <li>type: log type (optional)</li>
         * <li>nm: user name (optional)</li>
         * </ul>
         * @return {this}
         */
        send: function (obj) {
            var text, type, nm,
                $log_message = $("#log_message");

            obj = obj || {};
            text = obj.text || $log_message.val();
            type = obj.type || "chat";
            nm = obj.nm || ext.usr;

            ext.send("ins", "Log", {
                nm: nm,
                text: text,
                type: type

            }, function () {
                $log_message.val("");
            });

            return this;
        }
    });

    // View
    v[name] = Backbone.View.extend({
        events: {
            "click": "click",
            "keypress": "keypress"
        },

        initialize: function (opt, c) {
            var that = this;

            // bind model to the view
            this.model = new ext.m[name](opt);

            this.render();

            // appends only once
            c.$dest.prepend(this.$el);

            // draggable
            this.$el.draggable({
                handle: "#log_tbl"
            });

            // destroy
            this.model.bind("destroy", function () {
                that.remove();
            });
        },

        render: function () {
            this.$el = $(this.template());
        },

        click: function (args) {
            if (args.target.id === "log_send") {
                c[name].send();
            }
        },

        keypress: function (args) {
            if (args.target.id === "log_message") {
                if (args.keyCode === 13) {
                    c[name].send();
                }
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
