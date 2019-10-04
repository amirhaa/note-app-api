const {baseUrl} = require("../../utils/url");
const request = require("supertest");
const mongoose = require("mongoose");

let baseRoute = baseUrl("notes");
let server;

describe(baseRoute, () => {
    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        await server.close();
        await mongoose.disconnect();
    });

    describe("POSTS /", () => {
        it("Should create a new note", async () => {
            const res = await request(server)
                .post(baseRoute)
                .set('Accept', 'application/json')
                .send({
                    title: "This is a title",
                    content: "This is a content"
                });
            
            expect(res.status).toBe(200);
        });
    });
});