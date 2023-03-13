const server = require("../../index");
const request = require("supertest");

describe("/api/posts", () => {
    beforeEach(() => {
        server;
    });

    afterEach(() => {
        server.close();
    });

    describe("GET /", () => {
        it("should return all posts", async () => {
            const res = await request(server).get("/api/posts");
            expect(res.status).toBe(200);
        });
    });

    describe("GET /:id", () => {
        it("should return a post if valid id is passed", async () => {
            const res = await request(server).get("/api/posts/1");
            expect(res.status).toBe(200);
        });

        it("should return 404 if invalid id is passed", async () => {
            const res = await request(server).get("/api/posts/e");
            expect(res.status).toBe(404);
        });

        it("should return 404 if no post with the given id exists", async () => {
            const res = await request(server).get("/api/posts/999");
            expect(res.status).toBe(404);
        });

        it("should return a post if valid id is passed", async () => {
            const res = await request(server).get("/api/posts/1");
            expect(res.body).toHaveProperty("id", 1);
        });

        it("should return a post if valid id is passed", async () => {
            const res = await request(server).get("/api/posts/2");
            expect(res.body).toHaveProperty("user", "U2");
        });

        it("should return a post if valid id is passed", async () => {
            const res = await request(server).get("/api/posts/1");
            expect(res.body).toHaveProperty("body", "Hello Post 1");
        });

        it("should return a post if valid id is passed", async () => {
            const res = await request(server).get("/api/posts/2");
            expect(res.body).toHaveProperty("tags", ["U1", "U3"]);
        });
    });

    describe("POST /", () => {
        it("should return 400 if post is invalid", async () => {
            const res = await request(server).post("/api/posts");
            expect(res.status).toBe(400);
        });

        it("should return 400 if tags is not an array", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({ user: 10, body: "Hello Post", tags: "U1" });
            expect(res.status).toBe(400);
        });

        it("should save the post if tags is null", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({ user: 10, body: "Hello Post" });
            expect(res.status).toBe(200);
        });

        it("should save the post if it is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({ user: 10, body: "Hello Post", tags: ["U1", "U3"] });
            expect(res.status).toBe(200);
        });

        it("should return the post if it is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({ user: 10, body: "Hello Post", tags: ["U1", "U3"] });
            expect(res.body[3]).toHaveProperty("id", 4);
        });

        it("should return the post if it is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({ user: 10, body: "Hello Post", tags: ["U1", "U3"] });
            expect(res.body[4]).toHaveProperty("user", 10);
        });

        it("should return the post if it is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({ user: 10, body: "Hello Post", tags: ["U1", "U3"] });
            expect(res.body[5]).toHaveProperty("body", "Hello Post");
        });

        it("should return the post if it is valid", async () => {
            const res = await request(server)
                .post("/api/posts")
                .send({ user: 10, body: "Hello Post", tags: ["U1", "U3"] });
            expect(res.body[6]).toHaveProperty("tags", ["U1", "U3"]);
        });
    });

    describe("PUT /:id", () => {
        it("should return 404 if request is invalid", async () => {
            const res = await request(server).put("/api/posts/10");
            expect(res.status).toBe(404);
        });

        it("should return 404 if id is invalid", async () => {
            const res = await request(server)
                .put("/api/posts/10")
                .send({ user: 10, body: "Hello Post 3", tags: ["U1", "U3"] });
            expect(res.status).toBe(404);
        });

        it("should return 400 if it the body.body is null", async () => {
            const res = await request(server)
                .put("/api/posts/1")
                .send({
                    user: 10,
                    tags: ["U1", "U3"],
                });
            expect(res.status).toBe(400);
        });

        it("should return 400 if it the body.tags is invalid", async () => {
            const res = await request(server).put("/api/posts/1").send({
                user: 10,
                body: "Hello Post 3",
                tags: "U1",
            });
            expect(res.status).toBe(400);
        });

        it("should return 200 if tags is null", async () => {
            const res = await request(server).put("/api/posts/1").send({
                user: 10,
                body: "Hello Post 3",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if post is updated", async () => {
            const res = await await request(server)
                .put("/api/posts/1")
                .send({
                    user: 10,
                    body: "Hello Post 3",
                    tags: ["U1", "U3"],
                });
            expect(res.status).toBe(200);
        });
    });

    describe("DELETE /:id", () => {
        it("should return 404 if id is invalid", async () => {
            const res = await request(server).delete("/api/posts/10");
            expect(res.status).toBe(404);
        });

        it("should return 200 if post is deleted", async () => {
            const res = await request(server).delete("/api/posts/1");
            expect(res.status).toBe(200);
        });
    });
});
