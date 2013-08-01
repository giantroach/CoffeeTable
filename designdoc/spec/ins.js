describe("_design/coffee/updates/ins", function () {

    it("should be able to insert a data into doc[grp].data[] even though doc.grp is undefined.", function () {
        var doc = {},
            req = {
                form: {
                    guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                    grp: "jsmn"
                }
            };

        ins(doc, req);

        expect(doc.jsmn.data[0].guid).toEqual("Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e");
    });

    it("should be able to insert a data into doc[grp].data[] even though some data is already stored.", function () {
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

        ins(doc, req);

        expect(doc.jsmn.data[0].guid).toEqual("Jasmine_b897a0e0-5ac0-4446-b1b7-6aba3438f4e1");
        expect(doc.jsmn.data[1].guid).toEqual("Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e");
    });

});