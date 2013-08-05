describe("_design/coffee/updates/traBac", function () {

    it("should be able to transfer back all the data.", function () {
        var doc = {
                jsmn: {
                    dest: "center",
                    data: [
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
                        }
                    ]
                },
                jsmn_$moto: {
                    dest: "footer",
                    data: [
                        {
                            grp: "jsmn_$moto",
                            guid: "Jasmine_f195873f-ffd8-0cb1-1498-e240c5ece093"
                        },
                        {
                            grp: "jsmn_$moto",
                            guid: "Jasmine_c79ab111-1904-0da9-028e-9a9ced7df3ab"
                        }
                    ]
                },
                jsmn_$dick: {
                    dest: "footer",
                    data: [
                        {
                            grp: "jsmn_$dick",
                            guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e"
                        }
                    ]
                },
                jsmn_$played$: {
                    data: [
                        {
                            grp: "jsmn_$played$",
                            guid: "Jasmine_95fd70e2-8779-b1bb-a2bb-eef198915c8b"
                        }
                    ]
                },
                jsmn_$discarded$: {
                    data: [
                        {
                            grp: "jsmn_$discarded$",
                            guid: "Jasmine_8b2dae14-5719-c399-b271-da7547868bd4"
                        }
                    ]
                }
            },
            req = {
                form: {
                    grp: "jsmn",
                    nm: "mr. torgue"
                }
            },
            tm = new Date().toString();

        traBac(doc, req);

        expect(doc).toEqual({
            jsmn: {
                dest: "center",
                data: [
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
                    {
                        grp: "jsmn",
                        guid: "Jasmine_f195873f-ffd8-0cb1-1498-e240c5ece093",
                        tm: tm,
                        nm: "mr. torgue"
                    },
                    {
                        grp: "jsmn",
                        guid: "Jasmine_c79ab111-1904-0da9-028e-9a9ced7df3ab",
                        tm: tm,
                        nm: "mr. torgue"
                    },
                    {
                        grp: "jsmn",
                        guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                        tm: tm,
                        nm: "mr. torgue"
                    },
                    {
                        grp: "jsmn",
                        guid: "Jasmine_95fd70e2-8779-b1bb-a2bb-eef198915c8b",
                        tm: tm,
                        nm: "mr. torgue"
                    },
                    {
                        grp: "jsmn",
                        guid: "Jasmine_8b2dae14-5719-c399-b271-da7547868bd4",
                        tm: tm,
                        nm: "mr. torgue"
                    }
                ]
            },
            jsmn_$moto: {
                dest: "footer",
                data: []
            },
            jsmn_$dick: {
                dest: "footer",
                data: []
            },
            jsmn_$played$: {
                data: []
            },
            jsmn_$discarded$: {
                data: []
            }
        });
    });

});