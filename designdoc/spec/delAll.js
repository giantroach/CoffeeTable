describe("_design/coffee/updates/delAll", function () {

    it("should be able to delete multiple data in a grp.", function () {
        var doc = {
                jsmn: {
                    dest: "center",
                    data: [
                        {
                            grp: "jsmn",
                            guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                            brand: "torgue",
                            nm: "moto"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_f195873f-ffd8-0cb1-1498-e240c5ece093",
                            brand: "jakobs",
                            nm: "moto"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_c79ab111-1904-0da9-028e-9a9ced7df3ab",
                            brand: "maliwan",
                            nm: "moto"
                        }
                    ]
                },
                ksmn: {
                    dest: "right",
                    data: [
                        {
                            grp: "ksmn",
                            guid: "Jasmine_aed26ca1-0b79-b7b2-62b4-31525c8d8d6e"
                        }
                    ]
                }
            },
            req = {
                form: {
                    grp: "jsmn"
                }
            };

        delAll(doc, req);

        expect(doc).toEqual({
            jsmn: {
                dest: "center",
                data: []
            },
            ksmn: {
                dest: "right",
                data: [
                    {
                        grp: "ksmn",
                        guid: "Jasmine_aed26ca1-0b79-b7b2-62b4-31525c8d8d6e"
                    }
                ]
            }
        });
    });

    it("should be able to handle even if there's no target data.", function () {
        var doc = {
                jsmn: {
                    dest: "center",
                    data: []
                },
                ksmn: {
                    dest: "right",
                    data: [
                        {
                            grp: "ksmn",
                            guid: "Jasmine_aed26ca1-0b79-b7b2-62b4-31525c8d8d6e"
                        }
                    ]
                }
            },
            req = {
                form: {
                    grp: "jsmn"
                }
            };

        delAll(doc, req);

        expect(doc).toEqual({
            jsmn: {
                dest: "center",
                data: []
            },
            ksmn: {
                dest: "right",
                data: [
                    {
                        grp: "ksmn",
                        guid: "Jasmine_aed26ca1-0b79-b7b2-62b4-31525c8d8d6e"
                    }
                ]
            }
        });
    });

});