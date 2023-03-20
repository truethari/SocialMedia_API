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

describe("postController", () => {
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

    describe("POST /", () => {
        it("should return 400 if request is invalid", async () => {
            const res = await request(server)
                .post("/api/users")
                .send({ name: "1234" });
            expect(res.status).toBe(400);
        });

        it("should return 401 if unauthorized", async () => {
            const res = await request(server).post("/api/posts").send({
                userId: "3",
                title: "title",
                body: "body",
            });
            expect(res.status).toBe(401);
        });

        it("should return 401 if logged user tries to create post for another user", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({
                    userId: "1",
                    title: "title",
                    body: "body",
                })
                .set("x-auth-token", token_user_2);
            expect(res.status).toBe(401);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({
                    userId: "1",
                    title: "title",
                    body: "body",
                })
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({
                    userId: "2",
                    title: "title",
                    body: "body",
                })
                .set("x-auth-token", token_user_2);
            expect(res.status).toBe(200);
        });
    });

    describe("GET /", () => {
        it("should return 401 if unauthorized", async () => {
            const res = await request(server).get("/api/posts");
            expect(res.status).toBe(401);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .get("/api/posts")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });
    });

    describe("GET /:id", () => {
        it("should return 401 if unauthorized", async () => {
            const res = await request(server).get("/api/posts/1");
            expect(res.status).toBe(401);
        });

        it("should return 404 if post not found", async () => {
            const res = await request(server)
                .get("/api/posts/999")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(404);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .get("/api/posts/1")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });
    });

    describe("PUT /:id", () => {
        it("should return 401 if unauthorized", async () => {
            const res = await request(server)
                .put("/api/posts/1")
                .send({ title: "title" });
            expect(res.status).toBe(401);
        });

        it("should return 404 if post not found", async () => {
            const res = await request(server)
                .put("/api/posts/999")
                .send({ title: "title" })
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(404);
        });

        it("should return 401 if logged user tries to update post for another user", async () => {
            const res = await request(server)
                .put("/api/posts/2")
                .send({ userId: "2", title: "title" })
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(401);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .put("/api/posts/1")
                .send({ userId: "1", title: "title" })
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .put("/api/posts/2")
                .send({ userId: "2", title: "title" })
                .set("x-auth-token", token_user_2);
            expect(res.status).toBe(200);
        });
    });

    describe("DELETE /:id", () => {
        it("should return 401 if unauthorized", async () => {
            const res = await request(server).delete("/api/posts/1");
            expect(res.status).toBe(401);
        });

        it("should return 404 if post not found", async () => {
            const res = await request(server)
                .delete("/api/posts/999")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(404);
        });

        it("should return 401 if logged user tries to delete post for another user", async () => {
            const res = await request(server)
                .delete("/api/posts/2")
                .send({ userId: "2" })
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(401);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .delete("/api/posts/1")
                .send({ userId: "1" })
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });
    });
});
