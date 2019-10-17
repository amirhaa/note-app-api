const {
    baseUrl
} = require("../../utils/url");
const request = require("supertest");
const mongoose = require("mongoose");
const {ObjectId} = require("mongoose").Types;
const {
    NoteModel
} = require('../../models/notes');

let baseRoute = baseUrl("notes");
let objectId = new ObjectId;
let server;

const sendPostRequest = payload => request(server).post(baseRoute).set('Accept', 'application/json').send(payload);
const sendGetRequest = (id) => request(server).get(`${baseRoute}/${id}`).set('Accept', 'application/json').send();
const sendPatchRequest = (id, payload) => request(server).patch(`${baseRoute}/${id}`).set('Accept', 'application/json').send(payload);
const sendDeleteRequest = (id) => request(server).delete(`${baseRoute}/${id}`).set('Accept', 'application/json').send();

const createNote = (obj) => NoteModel.create(obj);

describe(baseRoute, () => {
    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        await NoteModel.deleteMany({});
    });
    afterAll(async () => {
        await server.close();
        await mongoose.disconnect();
    });

    describe("POSTS /", () => {
        it("Should create a new note", async () => {
            const res = await sendPostRequest({
                title: "This is a title",
                content: "This is a content"
            });

            expect(res.status).toBe(201);
        });

        it("Should return 400 if payload is empty", async () => {
            const res = await sendPostRequest({});

            expect(res.status).toBe(400);
        });

        it("Should return 400 if payload is not valid", async () => {
            const res = await sendPostRequest({
                title: 0
            });

            expect(res.status).toBe(400);
        });
    });

    describe("GET /:id", () => {
        it("Should return 400 if id is not a valid mongo id", async () => {
            const res = await sendGetRequest('123');

            expect(res.status).toBe(400);
        });

        it("Should return 404 if objectId is not found in mongo", async () => {
            const res = await sendGetRequest(objectId);

            expect(res.status).toBe(404);
        });

        it("Should return a note object if id is valid", async () => {
            const obj = {
                title: 'This is a title'
            };
            const note = await createNote(obj);

            const res = await sendGetRequest(note._id);

            expect(res.status).toBe(200);
            expect(res.body.title).toEqual(obj.title);
        });
    });

    describe("PATCH /:id", () => {
        it("Should return 400 if id is note valid", async () => {
            const res = await sendPatchRequest('123', { title: 'This is another title '});

            expect(res.status).toBe(400);
        });

        it("Should return 404 if no object found with id", async () => {
            const res = await sendPatchRequest(objectId, { title: 'This is another title' });

            expect(res.status).toBe(404);
        });

        it("Should return 400 if payload is not valid", async () => {
            const res = await sendPatchRequest(objectId, { title: 123 });

            expect(res.status).toBe(400);
        });

        it("Should return 400 if payload is empty", async () => {
            const res = await sendPatchRequest(objectId);

            expect(res.status).toBe(400);
        });

        it("Should return a updated object if id is valid", async () => {
            const obj = { title: "This is a title" };
            const note = await createNote(obj);

            const newObj = { title: 'This is another title' };
            const res = await sendPatchRequest(note._id, newObj);

            expect(res.status).toBe(200);
            expect((new ObjectId(res.body._id))).toEqual(note._id);
            expect(res.body.title).toEqual(newObj.title);
        });
    });

    describe("DELETE /:id", () => {
        it("Should return 400 if objectId is not valid", async () => {
            const res = await sendDeleteRequest('123');

            expect(res.status).toBe(400);
        });

        if("Should return deleted note object if id is valid", async () => {
            const noteObj = createNote({ title: 'This is a title' });

            const res = await sendDeleteRequest(noteObj._id);

            expect(res.status).toBe(200);
            expect(new ObjectId(res.body._id)).toEqual(noteObj._id);
            expect(res.body.title).toEqual(noteObj.title);
        });

        it("Should return 404 if no note object found with id", async () => {
            const res = await sendDeleteRequest(objectId);

            expect(res.status).toBe(404);
        });
    });

    describe("GET /", () => {
        it("Should return list of note objects", async () => {
            const items = [
                { title: 'first item' },
                { title: 'second item' },
            ];
            items.forEach(async i => await createNote(i));

            const res = await sendGetRequest('');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(items.length);
            expect(res.body[0]).toHaveProperty('title');
            expect(res.body[0]).toHaveProperty('_id');
        });

        it("Should return an empty list if no item is in db", async () => {
            const res = await sendGetRequest('');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });
});