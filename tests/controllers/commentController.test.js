const request = require("supertest");
const config = require("config");

const mongoose = require("mongoose");

let server;
let token_user_1;
let token_user_2;

function clearDatabase() {
    mongoose.connect(config.get("dbConnectionString")).then(() => {
        mongoose.connection.db.dropDatabase();
    });
}

describe("commentController", () => {
    clearDatabase();
    beforeEach(() => {
        server = require("../../index").server;
    });
    afterEach(() => {
        server.close();
    });

    describe("Create users before login", () => {
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

    describe("Login before tasks user 1", () => {
        it("should return 200 if request is valid", async () => {
            const res = await request(server).post("/api/login").send({
                email: "email@email.com",
                password: "12345678",
            });
            token_user_1 = res.body.token;
            expect(res.status).toBe(200);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server).post("/api/login").send({
                email: "email2@email.com",
                password: "12345678",
            });
            token_user_2 = res.body.token;
            expect(res.status).toBe(200);
        });
    });

    describe("Create post before tasks", () => {
        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .set("x-auth-token", token_user_1)
                .send({
                    title: "title",
                    body: "content",
                });
            expect(res.status).toBe(200);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .set("x-auth-token", token_user_2)
                .send({
                    title: "title",
                    body: "content",
                });
            expect(res.status).toBe(200);
        });
    });

    describe("POST /", () => {
        it("should return 401 if user is not logged in", async () => {
            const res = await request(server).post("/api/posts/1/comments");
            expect(res.status).toBe(401);
        });

        it("should return 404 if post id is not found", async () => {
            const res = await request(server)
                .post("/api/posts/100/comments")
                .set("x-auth-token", token_user_1)
                .send({
                    userId: 1,
                    body: "content",
                });
            expect(res.status).toBe(404);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .post("/api/posts/1/comments")
                .set("x-auth-token", token_user_1)
                .send({
                    body: "content",
                });
            expect(res.status).toBe(200);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .post("/api/posts/1/comments")
                .set("x-auth-token", token_user_2)
                .send({
                    body: "content",
                });
            expect(res.status).toBe(200);
        });
    });

    describe("GET /", () => {
        it("should return 401 if user is not logged in", async () => {
            const res = await request(server).get("/api/posts/1/comments");
            expect(res.status).toBe(401);
        });

        it("should return 404 if post id is not found", async () => {
            const res = await request(server)
                .get("/api/posts/100/comments")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(404);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .get("/api/posts/1/comments")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });
    });

    describe("PUT /", () => {
        it("should return 401 if user is not logged in", async () => {
            const res = await request(server).put("/api/posts/1/comments/1");
            expect(res.status).toBe(401);
        });

        it("should return 404 if post id is not found", async () => {
            const res = await request(server)
                .put("/api/posts/100/comments/1")
                .set("x-auth-token", token_user_1)
                .send({
                    body: "content",
                });
            expect(res.status).toBe(404);
        });

        it("should return 404 if comment id is not found", async () => {
            const res = await request(server)
                .put("/api/posts/1/comments/100")
                .set("x-auth-token", token_user_1)
                .send({
                    body: "content",
                });
            expect(res.status).toBe(404);
        });

        it("should return 401 if user try to update with other user id", async () => {
            const res = await request(server)
                .put("/api/posts/1/comments/1")
                .set("x-auth-token", token_user_2)
                .send({
                    body: "content",
                });
            expect(res.status).toBe(401);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .put("/api/posts/1/comments/1")
                .set("x-auth-token", token_user_1)
                .send({
                    body: "content",
                });
            expect(res.status).toBe(200);
        });
    });

    describe("DELETE /", () => {
        it("should return 401 if user is not logged in", async () => {
            const res = await request(server).delete("/api/posts/1/comments/1");
            expect(res.status).toBe(401);
        });

        it("should return 404 if post id is not found", async () => {
            const res = await request(server)
                .delete("/api/posts/100/comments/1")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(404);
        });

        it("should return 404 if comment id is not found", async () => {
            const res = await request(server)
                .delete("/api/posts/1/comments/100")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(404);
        });

        it("should return 401 if user try to delete with other user id", async () => {
            const res = await request(server)
                .delete("/api/posts/1/comments/1")
                .set("x-auth-token", token_user_2);
            expect(res.status).toBe(401);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .delete("/api/posts/1/comments/1")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });
    });
});
