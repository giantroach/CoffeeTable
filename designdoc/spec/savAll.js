describe("_design/coffee/updates/savAll", function () {

    it("should be able to add and update at same time.", function () {
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
                    nm: "moto",
                    grp: "jsmn",
                    "data[0][grp]": "jsmn",
                    "data[0][guid]": "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                    "data[0][brand]": "torgue",
                    "data[1][grp]": "jsmn",
                    "data[1][guid]": "Jasmine_f195873f-ffd8-0cb1-1498-e240c5ece093",
                    "data[1][brand]": "jakobs",
                    "data[2][grp]": "jsmn",
                    "data[2][guid]": "Jasmine_c79ab111-1904-0da9-028e-9a9ced7df3ab",
                    "data[2][brand]": "maliwan",
                }
            },
            tm = new Date().toString();

        savAll(doc, req);

        expect(doc).toEqual({
            jsmn: {
                dest: "center",
                data: [
                    {
                        grp: "jsmn",
                        guid: "Jasmine_059e7249-23e7-9a7d-69fc-11a9d5a3ca8e",
                        brand: "torgue",
                        nm: "moto",
                        tm: tm
                    },
                    {
                        grp: "jsmn",
                        guid: "Jasmine_f195873f-ffd8-0cb1-1498-e240c5ece093",
                        brand: "jakobs",
                        nm: "moto",
                        tm: tm
                    },
                    {
                        grp: "jsmn",
                        guid: "Jasmine_c79ab111-1904-0da9-028e-9a9ced7df3ab",
                        brand: "maliwan",
                        nm: "moto",
                        tm: tm
                    }
                ]
            }
        });
    });

});