describe("_design/coffee/updates/del", function () {

    it("should be able to delete a data from doc[grp].data[] if the corresponding data is stored.", function () {
        var doc = {
                jsmn: {
                    dest: "center",
                    data: [
                        {
                            grp: "jsmn",
                            guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e"
                        }
                    ]
                }
            },
            req = {
                form: {
                    guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                    grp: "jsmn"
                }
            };

        del(doc, req);

        expect(doc.jsmn.data.length).toEqual(0);
        expect(doc).toEqual({
            jsmn: {
                dest: "center",
                data: []
            }
        });
    });

    it("should be able to delete a data from middle of doc[grp].data[] if the corresponding data is stored.", function () {
        var doc = {
                jsmn: {
                    dest: "center",
                    data: [
                        {
                            grp: "jsmn",
                            guid: "Jasmine_f195873f-ffd8-0cb1-1498-e240c5ece093"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_c79ab111-1904-0da9-028e-9a9ced7df3ab"
                        }
                    ]
                }
            },
            req = {
                form: {
                    grp: "jsmn",
                    guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e"
                }
            };

        del(doc, req);

        expect(doc.jsmn.data.length).toEqual(2);
        expect(doc).toEqual({
            jsmn: {
                dest: "center",
                data: [
                    {
                        grp: "jsmn",
                        guid: "Jasmine_f195873f-ffd8-0cb1-1498-e240c5ece093"
                    },
                    {
                        grp: "jsmn",
                        guid: "Jasmine_c79ab111-1904-0da9-028e-9a9ced7df3ab"
                    }
                ]
            }
        });
    });

    it("should be able to handle even if doc[grp].data[] is undefined.", function () {
        var doc = {},
            req = {
                form: {
                    guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                    grp: "jsmn"
                }
            };

        del(doc, req);

        expect(doc).toEqual({});
    });

    it("should be able to handle even if doc[grp].data[] does not have the target data.", function () {
        var doc = {
                jsmn: {
                    dest: "center",
                    data: [
                        {
                            grp: "jsmn",
                            guid: "Jasmine_b897a0e0-5ac0-4446-b1b7-6aba3438f4e1"
                        }
                    ]
                }
            },
            req = {
                form: {
                    guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                    grp: "jsmn"
                }
            };

        del(doc, req);

        expect(doc).toEqual({
            jsmn: {
                dest: "center",
                data: [
                    {
                        grp: "jsmn",
                        guid: "Jasmine_b897a0e0-5ac0-4446-b1b7-6aba3438f4e1"
                    }
                ]
            }
        });
    });

});