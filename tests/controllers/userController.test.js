const request = require("supertest");
const config = require("config");

const mongoose = require("mongoose");

const { User } = require("../../models/user");

let server;
let token_user_1;
let token_user_2;
let userObject_1;
let userObject_2;

function randomEmail(length) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    return result + "@email.com";
}

function clearDatabase() {
    mongoose.connect(config.get("dbConnectionString")).then(() => {
        mongoose.connection.db.dropDatabase();
    });
}

describe("userController", () => {
    clearDatabase();
    beforeEach(() => {
        server = require("../../index").server;
    });
    afterEach(() => {
        server.close();
    });

    describe("POST /", () => {
        it("should return 400 if request is invalid", async () => {
            const res = await request(server)
                .post("/api/users")
                .send({ name: "1234" });
            expect(res.status).toBe(400);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server).post("/api/users").send({
                fName: "name",
                lName: "name",
                email: "email@email.com",
                password: "12345678",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server).post("/api/users").send({
                fName: "name",
                lName: "name",
                email: "email2@email.com",
                password: "12345678",
            });
            expect(res.status).toBe(200);
        });
    });

    describe("LOGIN /", () => {
        it("should return 404 if email is not found", async () => {
            const res = await request(server)
                .post("/api/users/login")
                .send({
                    email: randomEmail(10),
                    password: "12345678",
                });
            expect(res.status).toBe(404);
        });

        it("should return 200 if request is valid", async () => {
            userObject_1 = await User.findOne({ email: "email@email.com" });

            const res = await request(server).post("/api/login").send({
                email: "email@email.com",
                password: "12345678",
            });
            token_user_1 = res.body.token;
            expect(res.status).toBe(200);
        });

        it("should return 200 if request is valid", async () => {
            userObject_2 = await User.findOne({ email: "email2@email.com" });

            const res = await request(server).post("/api/login").send({
                email: "email2@email.com",
                password: "12345678",
            });
            token_user_2 = res.body.token;
            expect(res.status).toBe(200);
        });
    });

    describe("GET /", () => {
        it("should return 401 if not authorized", async () => {
            const res = await request(server).get("/api/users");
            expect(res.status).toBe(401);
        });

        it("should return 200 if authorized", async () => {
            const res = await request(server)
                .get("/api/users")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });
    });

    describe("GET /:id", () => {
        it("should return 401 if not authorized", async () => {
            const res = await request(server).get(
                "/api/users/" + userObject_1._id
            );
            expect(res.status).toBe(401);
        });

        it("should return 400 if user invalid", async () => {
            const res = await request(server)
                .get("/api/users/999")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(400);
        });

        it("should return 200 if user is found", async () => {
            const res = await request(server)
                .get("/api/users/" + userObject_1._id)
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });
    });

    describe("PUT /:id", () => {
        it("should return 401 if not authorized", async () => {
            const res = await request(server).put("/api/users/1");
            expect(res.status).toBe(401);
        });

        it("should return 400 if request is invalid", async () => {
            const res = await request(server)
                .put("/api/users/" + userObject_1._id)
                .set("x-auth-token", token_user_1)
                .send({ name: "1234" });
            expect(res.status).toBe(400);
        });

        it("should return 400 if user invalid", async () => {
            const res = await request(server)
                .put("/api/users/999")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(400);
        });
    });

    describe("DELETE /:id", () => {
        it("should return 401 if not authorized", async () => {
            const res = await request(server).delete(
                "/api/users/" + userObject_1._id
            );
            expect(res.status).toBe(401);
        });

        it("should return 401 if not authorized", async () => {
            const res = await request(server)
                .delete("/api/users/" + userObject_1._id)
                .set("x-auth-token", token_user_2);
            expect(res.status).toBe(401);
        });

        it("should return 404 if user invalid", async () => {
            const res = await request(server)
                .delete("/api/users/999")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(400);
        });

        it("should return 200 if user is found", async () => {
            const res = await request(server)
                .delete("/api/users/" + userObject_1._id)
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });
    });
});
