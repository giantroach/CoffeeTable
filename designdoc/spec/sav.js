describe("_design/coffee/updates/sav", function () {

    it("should be able to insert a data into doc[grp].data[] even though doc.grp is undefined.", function () {
        var doc = {},
            req = {
                form: {
                    nm: "moto",
                    grp: "jsmn",
                    guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e"
                }
            },
            tm = new Date().toString();

        sav(doc, req);

        expect(doc).toEqual({
            jsmn: {
                data: [
                    {
                        nm: "moto",
                        tm: tm,
                        grp: "jsmn",
                        guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                    }
                ]
            }
        });
    });

    it("should be able to insert a data into doc[grp].data[] if there's no corresponding data.", function () {
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
            },
            tm = new Date().toString();

        sav(doc, req);

        expect(doc).toEqual({
            jsmn: {
                dest: "center",
                data: [
                    {
                        grp: "jsmn",
                        guid: "Jasmine_b897a0e0-5ac0-4446-b1b7-6aba3438f4e1"
                    },
                    {
                        guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                        grp: "jsmn",
                        nm: "anonymous",
                        tm: tm
                    }
                ]
            }
        });
    });

    it("should be able to update a data into doc[grp].data[] if the corresponding data is stored.", function () {
        var doc = {
                jsmn: {
                    dest: "center",
                    data: [
                        {
                            grp: "jsmn",
                            guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                            boom: "old str"
                        }
                    ]
                }
            },
            req = {
                form: {
                    guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                    grp: "jsmn",
                    boom: "new str"
                }
            },
            tm = new Date().toString();

        sav(doc, req);

        expect(doc).toEqual({
            jsmn: {
                dest: "center",
                data: [
                    {
                        grp: "jsmn",
                        guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                        boom: "new str",
                        tm: tm,
                        nm: "anonymous"
                    }
                ]
            }
        });
    });

});