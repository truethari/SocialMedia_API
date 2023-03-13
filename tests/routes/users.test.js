const request = require("supertest");

let server;

describe("/api/users", () => {
    beforeEach(() => {
        server = require("../../index");
    });

    afterEach(() => {
        server.close();
    });

    describe("GET /", () => {
        it("should return all users", async () => {
            const res = await request(server).get("/api/users");
            expect(res.status).toBe(200);
        });
    });

    describe("GET /:id", () => {
        it("should return 404 if invalid id is passed", async () => {
            const res = await request(server).get("/api/users/e");
            expect(res.status).toBe(400);
        });

        it("should return 404 if no user with the given id exists", async () => {
            const res = await request(server).get("/api/users/999");
            expect(res.status).toBe(400);
        });

        it("should return a user if valid id is passed", async () => {
            const res = await request(server).get("/api/users/1");
            expect(res.status).toBe(200);
        });
    });

    describe("POST /", () => {
        it("should return 423 (locked) when try to POST requests", async () => {
            const res = await request(server).post("/api/users");
            expect(res.status).toBe(423);
        });
    });

    describe("PUT /:id", () => {
        it("should return 400 if no user with the given id exists", async () => {
            const res = await request(server).put("/api/users/999");
            expect(res.status).toBe(400);
        });

        it("should return 400 if invalid id is passed", async () => {
            const res = await request(server).put("/api/users/e");
            expect(res.status).toBe(400);
        });

        it("should return 400 if invalid fName is passed", async () => {
            const res = await request(server).put("/api/users/1").send({
                fName: "T",
                lName: "User",
                email: "e@email.com",
                birthday: "2000-01-01",
                gender: "M",
                password: "123456",
            });
            expect(res.status).toBe(400);
        });

        it("should return 400 if invalid email is passed", async () => {
            const res = await request(server).put("/api/users/1").send({
                fName: "Test",
                lName: "User",
                email: "email.com",
                birthday: "2000-01-01",
                gender: "M",
                password: "123456",
            });
            expect(res.status).toBe(400);
        });

        it("should return 400 if no user with the given id exists", async () => {
            const res = await request(server).put("/api/users/999").send({
                fName: "Test",
                lName: "User",
                email: "e@email.com",
                birthday: "2000-01-01",
                gender: "M",
                password: "123456",
            });
            expect(res.status).toBe(400);
        });

        it("should return 200 if valid id is passed", async () => {
            const res = await await request(server).put("/api/users/1").send({
                fName: "Test",
                lName: "User",
                email: "e@email.com",
                birthday: "2000-01-01",
                gender: "M",
                password: "123456",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if missed fName", async () => {
            const res = await request(server).put("/api/users/1").send({
                lName: "User",
                email: "e@email.com",
                birthday: "2000-01-01",
                gender: "M",
                password: "123456",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if missed lName", async () => {
            const res = await request(server).put("/api/users/1").send({
                fName: "Test",
                email: "e@email.com",
                birthday: "2000-01-01",
                gender: "M",
                password: "123456",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if missed email", async () => {
            const res = await request(server).put("/api/users/1").send({
                fName: "Test",
                lName: "User",
                birthday: "2000-01-01",
                gender: "M",
                password: "123456",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if missed birthday", async () => {
            const res = await request(server).put("/api/users/1").send({
                fName: "Test",
                lName: "User",
                email: "e@email.com",
                gender: "M",
                password: "123456",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if missed gender", async () => {
            const res = await request(server).put("/api/users/1").send({
                fName: "Test",
                lName: "User",
                email: "e@email.com",
                birthday: "2000-01-01",
                password: "123456",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if missed password", async () => {
            const res = await request(server).put("/api/users/1").send({
                fName: "Test",
                lName: "User",
                email: "e@email.com",
                birthday: "2000-01-01",
                gender: "M",
            });
            expect(res.status).toBe(200);
        });
    });

    describe("DELETE /:id", () => {
        it("should return 400 if invalid id is passed", async () => {
            const res = await request(server).delete("/api/users/e");
            expect(res.status).toBe(400);
        });

        it("should return 400 if no user with the given id exists", async () => {
            const res = await request(server).delete("/api/users/999");
            expect(res.status).toBe(400);
        });

        it("should return 200 if valid id is passed", async () => {
            const res = await request(server).delete("/api/users/1");
            expect(res.status).toBe(200);
        });
    });
});
