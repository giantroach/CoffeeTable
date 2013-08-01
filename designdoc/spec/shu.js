describe("_design/coffee/updates/shu", function () {

    it("should be able to shuffle the data.", function () {
        var doc = {
                jsmn: {
                    dest: "center",
                    data: [
                        {
                            grp: "jsmn",
                            guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_f195873f-ffd8-0cb1-1498-e240c5ece093"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_c79ab111-1904-0da9-028e-9a9ced7df3ab"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_8b2dae14-5719-c399-b271-da7547868bd4"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_95fd70e2-8779-b1bb-a2bb-eef198915c8b"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_8393519e-ae1b-caaf-55ec-2cca8242e643"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_2c39a669-4a93-c188-a558-c85e0bc85c5b"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_c3a73a46-f4d8-5616-db02-9ab499a47978"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_61265daa-ddd3-6288-a81d-4c3c20b2d874"
                        },
                        {
                            grp: "jsmn",
                            guid: "Jasmine_0eb07fb6-c323-d7f4-ff10-f8b870f7b4b7"
                        },
                    ]
                }
            },
            req = {
                form: {
                    grp: "jsmn",
                }
            },
            tm = new Date().toString();

        shu(doc, req);

        expect(doc.jsmn.data.length).toEqual(10);
        expect(doc.jsmn.data).not.toEqual([
            {
                grp: "jsmn",
                guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e"
            },
            {
                grp: "jsmn",
                guid: "Jasmine_f195873f-ffd8-0cb1-1498-e240c5ece093"
            },
            {
                grp: "jsmn",
                guid: "Jasmine_c79ab111-1904-0da9-028e-9a9ced7df3ab"
            },
            {
                grp: "jsmn",
                guid: "Jasmine_8b2dae14-5719-c399-b271-da7547868bd4"
            },
            {
                grp: "jsmn",
                guid: "Jasmine_95fd70e2-8779-b1bb-a2bb-eef198915c8b"
            },
            {
                grp: "jsmn",
                guid: "Jasmine_8393519e-ae1b-caaf-55ec-2cca8242e643"
            },
            {
                grp: "jsmn",
                guid: "Jasmine_2c39a669-4a93-c188-a558-c85e0bc85c5b"
            },
            {
                grp: "jsmn",
                guid: "Jasmine_c3a73a46-f4d8-5616-db02-9ab499a47978"
            },
            {
                grp: "jsmn",
                guid: "Jasmine_61265daa-ddd3-6288-a81d-4c3c20b2d874"
            },
            {
                grp: "jsmn",
                guid: "Jasmine_0eb07fb6-c323-d7f4-ff10-f8b870f7b4b7"
            },
        ]);
    });

    it("should be able to handle even if data is empty.", function () {
        var doc = {
                jsmn: {
                    dest: "center",
                    data: []
                }
            },
            req = {
                form: {
                    grp: "jsmn"
                }
            };

        shu(doc, req);

        expect(doc.jsmn.data.length).toEqual(0);
        expect(doc).toEqual({
            jsmn: {
                dest: "center",
                data: []
            }
        });
    });

});