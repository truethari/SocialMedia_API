const request = require("supertest");
const config = require("config");
const mongoose = require("mongoose");

const { Post } = require("../../models/post");

let server;
let token_user_1;
let token_user_2;
let postObject_1;
let postObject_2;

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
                email: "email4@email.com",
                password: "12345678",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server).post("/api/users").send({
                fName: "name",
                lName: "name",
                email: "email5@email.com",
                password: "12345678",
            });
            expect(res.status).toBe(200);
        });
    });

    describe("Login before tasks user 1", () => {
        it("should return 200 if request is valid", async () => {
            const res = await request(server).post("/api/login").send({
                email: "email4@email.com",
                password: "12345678",
            });
            token_user_1 = res.body.token;
            expect(res.status).toBe(200);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server).post("/api/login").send({
                email: "email5@email.com",
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
                title: "title",
                body: "body",
            });
            expect(res.status).toBe(401);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({
                    title: "post 1",
                    body: "body",
                })
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);

            postObject_1 = await Post.findOne({ title: "post 1" });
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({
                    title: "post 2",
                    body: "body",
                })
                .set("x-auth-token", token_user_2);
            expect(res.status).toBe(200);

            postObject_2 = await Post.findOne({ title: "post 2" });
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
            const res = await request(server).get(
                "/api/posts/" + postObject_1._id
            );
            expect(res.status).toBe(401);
        });

        it("should return 400 if id is invalid", async () => {
            const res = await request(server)
                .get("/api/posts/999")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(400);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .get("/api/posts/" + postObject_1._id)
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });
    });

    describe("PUT /:id", () => {
        it("should return 401 if unauthorized", async () => {
            const res = await request(server)
                .put("/api/posts/" + postObject_1._id)
                .send({ title: "title" });
            expect(res.status).toBe(401);
        });

        it("should return 400 if id is invalid", async () => {
            const res = await request(server)
                .put("/api/posts/999")
                .send({ title: "title" })
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(400);
        });

        it("should return 401 if logged user tries to update post for another user", async () => {
            const res = await request(server)
                .put("/api/posts/" + postObject_1._id)
                .send({ title: "title" })
                .set("x-auth-token", token_user_2);
            expect(res.status).toBe(401);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .put("/api/posts/" + postObject_1._id)
                .send({ title: "title" })
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .put("/api/posts/" + postObject_2._id)
                .send({ title: "title" })
                .set("x-auth-token", token_user_2);
            expect(res.status).toBe(200);
        });
    });

    describe("DELETE /:id", () => {
        it("should return 401 if unauthorized", async () => {
            const res = await request(server).delete(
                "/api/posts/" + postObject_1._id
            );
            expect(res.status).toBe(401);
        });

        it("should return 400 if id is invalid", async () => {
            const res = await request(server)
                .delete("/api/posts/999")
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(400);
        });

        it("should return 401 if logged user tries to delete post for another user", async () => {
            const res = await request(server)
                .delete("/api/posts/" + postObject_2._id)
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(401);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .delete("/api/posts/" + postObject_1._id)
                .set("x-auth-token", token_user_1);
            expect(res.status).toBe(200);
        });
    });
});
