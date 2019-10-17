const {
    baseUrl
} = require("../../utils/url");
const mongoose = require("mongoose");
const request = require("supertest");
const {UserModel} = require("../../models/user");

const baseRoute = baseUrl("auth");
let server;

const sendPostRequest = (path, payload) => request(server)
    .post(`${baseRoute}/${path}`)
    .set('Accept', 'application/json')
    .send(payload);

const createUser = ({email, password}) => {
    const user = new UserModel();
    user.email = email;
    user.password = user.generateHashedPassword(password);
    return user.save();
}    

describe(baseRoute, () => {
    beforeAll(async () => {
        server = await require("../../index");
    });
    afterEach(async () => {
        await UserModel.deleteMany({});
    });
    afterAll(async () => {
        await server.close();
        await mongoose.disconnect();
    });

    describe("POST /register", () => {
        it("Should return 400 if payload is empty", async () => {
            const res = await sendPostRequest('/register');

            expect(res.status).toBe(400);
        });

        it("Should return 400 if email is invalid", async () => {
            const res = await sendPostRequest('/register', { email: "invalidEmail", password: "validPassword123" });

            expect(res.status).toBe(400);
        });

        it("Should return 400 if password is invalid", async () => {
            const res = await sendPostRequest('/register', { email: "validemail@gmail.com" , password: "1" });

            expect(res.status).toBe(400);
        });

        it("Should register user if payloads are valid", async () => {
            const userObj = { email: 'validemail@gmail.com' , password: 'validpassword123' };
            const res = await sendPostRequest('/register', userObj);

            expect(res.status).toBe(201);
            expect(res.body.email).toEqual(userObj.email);
            expect(res.body).toHaveProperty('token');
        });

        it("Should return 404 if user already registered with this email", async () => {
            await createUser({ email: 'we@gmail.com', password: '123456' });

            const res = await sendPostRequest('/register', { email: 'we@gmail.com' , password: '654321' });

            expect(res.status).toBe(400);
        });
    });

    describe("POST /token", () => {
        it("Should return 400 if payload is empty", async () => {
            const res = await sendPostRequest('/token', {});

            expect(res.status).toBe(400);
        });

        it("Should return 400 if email is invalid", async () => {
            const res = await sendPostRequest('/token', { email: 'invalidEmail', passowrd: 'validpassword123' });

            expect(res.status).toBe(400);
        });

        it("Should return 400 if password is invalid", async () => {
            const res = await sendPostRequest('/token', { email: 'validEmail@gmail.com' , password: '1' });

            expect(res.status).toBe(400);
        });

        it("Should return 404 if email is not registered", async () => {
            await createUser({ email: 'me@gmail.com', password: '123456' });

            const res = await sendPostRequest('/token', { email: 'you@gmail.com' , password: '123456' });

            expect(res.status).toBe(404);
            expect(res.error.text).toEqual('email or password is wrong or no user registered yet');
        });

        it("Should return 404 if password is wrong", async () => {
            await createUser({ email: 'he@gmail.com', password: '123456' });

            const res = await sendPostRequest('/token', { email: 'me@gmail.com', password: '654321' });

            expect(res.status).toBe(404);
            expect(res.error.text).toEqual('email or password is wrong or no user registered yet');
        });

        it("Should return a token if email & password are correct", async () => {
            const userObj = { email: 'she@gmail.com', password: '123456' };
            await createUser(userObj);

            const res = await sendPostRequest('/token', userObj);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });
    });
});