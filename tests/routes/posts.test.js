const request = require("supertest");

let server;
let sqlCommand;

describe("/api/posts", () => {
    beforeEach(() => {
        server = require("../../index").server;
    });

    afterEach(() => {
        server.close();
    });

    describe("POST /", () => {
        beforeEach(async () => {
            sqlCommand = require("../../utils/db");

            await sqlCommand(
                "INSERT INTO users (id, fName, lName, email, birthday, gender, role, password) VALUES (? , ? , ? , ? , ? , ? , ? , ?);",
                [
                    1000,
                    "test",
                    "name",
                    "e@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );

            await sqlCommand(
                "INSERT INTO posts (id, user, title, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, "test", "test"]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM posts;");
            await sqlCommand("DELETE FROM users;");
        });

        it("should return 400 if post is invalid", async () => {
            const res = await request(server).post("/api/posts");
            expect(res.status).toBe(400);
        });

        it("should save the post if it is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({ user: 1000, title: "test", body: "Test Post" });
            expect(res.status).toBe(200);
        });

        it("should return the post if it is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({ user: 1000, title: "test", body: "Test Post 3" });
            expect(res.body).toHaveProperty("user", 1000);
        });

        it("should return 404 if user does not exist", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({ user: 1001, title: "test", body: "Test Post" });
            expect(res.status).toBe(404);
        });
    });

    describe("PUT /:id", () => {
        beforeEach(async () => {
            sqlCommand = require("../../utils/db");

            await sqlCommand(
                "INSERT INTO users (id, fName, lName, email, birthday, gender, role, password) VALUES (? , ? , ? , ? , ? , ? , ? , ?);",
                [
                    1000,
                    "test",
                    "name",
                    "testt@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );

            await sqlCommand(
                "INSERT INTO posts (id, user, title, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, "test", "test"]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM posts;");
            await sqlCommand("DELETE FROM users;");
        });

        it("should return 404 if post does not exist", async () => {
            const res = await request(server).put("/api/posts/1");
            expect(res.status).toBe(404);
        });

        it("should return 400 if request is empty", async () => {
            const res = await request(server).put("/api/posts/1000");
            expect(res.status).toBe(400);
        });

        it("should return 404 if id is invalid", async () => {
            const res = await request(server).put("/api/posts/2000");
            expect(res.status).toBe(404);
        });

        it("should return 404 if id is invalid", async () => {
            const res = await request(server).put("/api/posts/e");
            expect(res.status).toBe(404);
        });

        it("should return 400 if title is empty or invalid", async () => {
            const res = await request(server)
                .put("/api/posts/1000")
                .send({ title: "aa" });
            expect(res.status).toBe(400);
        });

        it("should return 400 if body is empty or invalid", async () => {
            const res = await request(server)
                .put("/api/posts/1000")
                .send({ body: "aa" });
            expect(res.status).toBe(400);
        });

        it("should return 200 if if only title is passed", async () => {
            const res = await request(server)
                .put("/api/posts/1000")
                .send({ title: "test" });
            expect(res.status).toBe(200);
        });

        it("should return 200 if only body is passed", async () => {
            const res = await request(server)
                .put("/api/posts/1000")
                .send({ body: "test" });
            expect(res.status).toBe(200);
        });

        it("should return the post if request is valid", async () => {
            const res = await request(server)
                .put("/api/posts/1000")
                .send({ title: "test" });
            expect(res.body).toHaveProperty("title", "test");
        });
    });

    describe("GET /", () => {
        beforeEach(async () => {
            sqlCommand = require("../../utils/db");

            await sqlCommand(
                "INSERT INTO users (id, fName, lName, email, birthday, gender, role, password) VALUES (? , ? , ? , ? , ? , ? , ? , ?);",
                [
                    1000,
                    "test",
                    "name",
                    "testt@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );

            await sqlCommand(
                "INSERT INTO posts (id, user, title, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, "test", "test"]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM posts;");
            await sqlCommand("DELETE FROM users;");
        });

        it("should return 404 if no posts are found", async () => {
            await sqlCommand("DELETE FROM posts;");
            const res = await request(server).get("/api/posts");
            expect(res.status).toBe(404);
        });

        it("should return all posts", async () => {
            const res = await request(server).get("/api/posts");
            expect(res.status).toBe(200);
        });
    });

    describe("GET /:id", () => {
        beforeEach(async () => {
            sqlCommand = require("../../utils/db");

            await sqlCommand(
                "INSERT INTO users (id, fName, lName, email, birthday, gender, role, password) VALUES (? , ? , ? , ? , ? , ? , ? , ?);",
                [
                    1000,
                    "test",
                    "name",
                    "testt@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );

            await sqlCommand(
                "INSERT INTO posts (id, user, title, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, "test", "test"]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM posts;");
            await sqlCommand("DELETE FROM users;");
        });

        it("should return 404 if invalid id is passed", async () => {
            const res = await request(server).get("/api/posts/e");
            expect(res.status).toBe(404);
        });

        it("should return 404 if post with the given id was not found", async () => {
            const res = await request(server).get("/api/posts/2000");
            expect(res.status).toBe(404);
        });

        it("should return a post if valid id is passed", async () => {
            const res = await request(server).get("/api/posts/1000");
            expect(res.status).toBe(200);
        });
    });

    describe("DELETE /:id", () => {
        beforeEach(async () => {
            sqlCommand = require("../../utils/db");

            await sqlCommand(
                "INSERT INTO users (id, fName, lName, email, birthday, gender, role, password) VALUES (? , ? , ? , ? , ? , ? , ? , ?);",
                [
                    1000,
                    "test",
                    "name",
                    "testt@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );

            await sqlCommand(
                "INSERT INTO posts (id, user, title, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, "test", "test"]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM posts;");
            await sqlCommand("DELETE FROM users;");
        });

        it("should return 404 if invalid id is passed", async () => {
            const res = await request(server).delete("/api/posts/e");
            expect(res.status).toBe(404);
        });

        it("should return 404 if post with the given id was not found", async () => {
            const res = await request(server).delete("/api/posts/2000");
            expect(res.status).toBe(404);
        });

        it("should return 200 if post with the given id was deleted", async () => {
            const res = await request(server).delete("/api/posts/1000");
            expect(res.status).toBe(200);
        });

        it("should return 500 if post has comments", async () => {
            await sqlCommand(
                "INSERT INTO comments (id, user, post, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, 1000, "test"]
            );

            const res = await request(server).delete("/api/posts/1000");
            expect(res.status).toBe(500);
        });
    });

    describe("POST /:id/comments", () => {
        beforeEach(async () => {
            sqlCommand = require("../../utils/db");

            await sqlCommand(
                "INSERT INTO users (id, fName, lName, email, birthday, gender, role, password) VALUES (? , ? , ? , ? , ? , ? , ? , ?);",
                [
                    1000,
                    "test",
                    "name",
                    "testt@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );

            await sqlCommand(
                "INSERT INTO posts (id, user, title, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, "test", "test"]
            );

            await sqlCommand(
                "INSERT INTO comments (id, user, post, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, 1000, "test"]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM posts;");
            await sqlCommand("DELETE FROM users;");
            await sqlCommand("DELETE FROM comments;");
        });

        it("should return 404 if post does not exist", async () => {
            const res = await request(server).post("/api/posts/2000/comments");
            expect(res.status).toBe(404);
        });

        it("should return 404 if requst is invalid", async () => {
            const res = await request(server).post("/api/posts/1000/comments");
            expect(res.status).toBe(404);
        });

        it("should return 400 if body is invalid", async () => {
            const res = await request(server)
                .post("/api/posts/1000/comments")
                .send({ user: 1000, body: "a" });
            expect(res.status).toBe(400);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .post("/api/posts/1000/comments")
                .send({ user: 1000, body: "test" });
            expect(res.status).toBe(200);
        });
    });

    describe("PUT /:id/comments/:commentId", () => {
        beforeEach(async () => {
            sqlCommand = require("../../utils/db");

            await sqlCommand(
                "INSERT INTO users (id, fName, lName, email, birthday, gender, role, password) VALUES (? , ? , ? , ? , ? , ? , ? , ?);",
                [
                    1000,
                    "test",
                    "name",
                    "testt@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );

            await sqlCommand(
                "INSERT INTO posts (id, user, title, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, "test", "test"]
            );

            await sqlCommand(
                "INSERT INTO comments (id, user, post, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, 1000, "test"]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM posts;");
            await sqlCommand("DELETE FROM users;");
            await sqlCommand("DELETE FROM comments;");
        });

        it("should return 404 if post does not exist", async () => {
            const res = await request(server).put(
                "/api/posts/2000/comments/1000"
            );
            expect(res.status).toBe(404);
        });

        it("should return 404 if comment does not exist", async () => {
            const res = await request(server).put(
                "/api/posts/1000/comments/2000"
            );
            expect(res.status).toBe(404);
        });

        it("should return 400 if request is invalid", async () => {
            const res = await request(server).put(
                "/api/posts/1000/comments/1000"
            );
            expect(res.status).toBe(400);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server)
                .put("/api/posts/1000/comments/1000")
                .send({ body: "test" });
            expect(res.status).toBe(200);
        });
    });

    describe("GET /:id/comments", () => {
        beforeEach(async () => {
            sqlCommand = require("../../utils/db");

            await sqlCommand(
                "INSERT INTO users (id, fName, lName, email, birthday, gender, role, password) VALUES (? , ? , ? , ? , ? , ? , ? , ?);",
                [
                    1000,
                    "test",
                    "name",
                    "testt@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );

            await sqlCommand(
                "INSERT INTO posts (id, user, title, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, "test", "test"]
            );

            await sqlCommand(
                "INSERT INTO comments (id, user, post, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, 1000, "test"]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM posts;");
            await sqlCommand("DELETE FROM users;");
            await sqlCommand("DELETE FROM comments;");
        });

        it("should return 404 if post does not exist", async () => {
            const res = await request(server).get("/api/posts/2000/comments");
            expect(res.status).toBe(404);
        });

        it("should return 404 if no comments exist", async () => {
            await sqlCommand("DELETE FROM comments;");
            const res = await request(server).get("/api/posts/1000/comments");
            expect(res.status).toBe(404);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server).get("/api/posts/1000/comments");
            expect(res.status).toBe(200);
        });
    });

    describe("GET /:id/comments/:commentId", () => {
        beforeEach(async () => {
            sqlCommand = require("../../utils/db");

            await sqlCommand(
                "INSERT INTO users (id, fName, lName, email, birthday, gender, role, password) VALUES (? , ? , ? , ? , ? , ? , ? , ?);",
                [
                    1000,
                    "test",
                    "name",
                    "testt@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );

            await sqlCommand(
                "INSERT INTO posts (id, user, title, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, "test", "test"]
            );

            await sqlCommand(
                "INSERT INTO comments (id, user, post, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, 1000, "test"]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM posts;");
            await sqlCommand("DELETE FROM users;");
            await sqlCommand("DELETE FROM comments;");
        });

        it("should return 404 if post does not exist", async () => {
            const res = await request(server).get(
                "/api/posts/2000/comments/1000"
            );
            expect(res.status).toBe(404);
        });

        it("should return 404 if comment does not exist", async () => {
            const res = await request(server).get(
                "/api/posts/1000/comments/2000"
            );
            expect(res.status).toBe(404);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server).get(
                "/api/posts/1000/comments/1000"
            );
            expect(res.status).toBe(200);
        });
    });

    describe("DELETE /:id/comments/:commentId", () => {
        beforeEach(async () => {
            sqlCommand = require("../../utils/db");

            await sqlCommand(
                "INSERT INTO users (id, fName, lName, email, birthday, gender, role, password) VALUES (? , ? , ? , ? , ? , ? , ? , ?);",
                [
                    1000,
                    "test",
                    "name",
                    "testt@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );

            await sqlCommand(
                "INSERT INTO posts (id, user, title, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, "test", "test"]
            );

            await sqlCommand(
                "INSERT INTO comments (id, user, post, body) VALUES (?, ?, ?, ?);",
                [1000, 1000, 1000, "test"]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM posts;");
            await sqlCommand("DELETE FROM users;");
            await sqlCommand("DELETE FROM comments;");
        });

        it("should return 404 if post does not exist", async () => {
            const res = await request(server).delete(
                "/api/posts/2000/comments/1000"
            );
            expect(res.status).toBe(404);
        });

        it("should return 404 if comment does not exist", async () => {
            const res = await request(server).delete(
                "/api/posts/1000/comments/2000"
            );
            expect(res.status).toBe(404);
        });

        it("should return 200 if request is valid", async () => {
            const res = await request(server).delete(
                "/api/posts/1000/comments/1000"
            );
            expect(res.status).toBe(200);
        });
    });
});
