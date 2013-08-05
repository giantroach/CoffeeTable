describe("_design/coffee/updates/resTem", function () {

    it("should be able to reset data according to the templates.", function () {
        var doc = {
                $_def: {
                    templates: {
                        jsmn: [
                            {
                                cls: "torgue"
                            },
                            {
                                cls: "hyperion",
                                rotation: "true"
                            },
                            {
                                cls: "maliwan"
                            }
                        ]
                    }
                }
            },
            req = {
                form: {
                    grp: "jsmn",
                    nm: "mr. torgue"
                }
            },
            tm = new Date().toString();

        resTem(doc, req);

        expect(doc).toEqual({
            $_def: {
                templates: {
                    jsmn: [
                        {
                            cls: "torgue"
                        },
                        {
                            cls: "hyperion",
                            rotation: "true"
                        },
                        {
                            cls: "maliwan"
                        }
                    ]
                }
            },

            jsmn: {
                data: [
                    {
                        cls: "torgue",
                        tm: tm,
                        nm: "mr. torgue",
                        grp: "jsmn",
                        guid: doc.jsmn.data[0].guid // because there's no way to know...
                    },
                    {
                        cls: "hyperion",
                        rotation: "true",
                        tm: tm,
                        nm: "mr. torgue",
                        grp: "jsmn",
                        guid: doc.jsmn.data[1].guid
                    },
                    {
                        cls: "maliwan",
                        tm: tm,
                        nm: "mr. torgue",
                        grp: "jsmn",
                        guid: doc.jsmn.data[2].guid
                    }
                ]
            }
        });
    });

});