const request = require("supertest");

let server;
let sqlCommand;

describe("/api/users", () => {
    beforeEach(() => {
        server = require("../../index").server;
    });

    afterEach(() => {
        server.close();
    });

    describe("POST /", () => {
        it("should return 423 (locked) when try to POST requests", async () => {
            const res = await request(server).post("/api/users");
            expect(res.status).toBe(423);
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
                    "e@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM users;");
        });

        it("should return 400 if no body is passed", async () => {
            const res = await request(server).put("/api/users/1000");
            expect(res.status).toBe(400);
        });

        it("should return 400 if invalid fName is passed", async () => {
            const res = await request(server).put("/api/users/1000").send({
                fName: "T",
            });
            expect(res.status).toBe(400);
        });

        it("should return 404 if no user with the given id exists", async () => {
            const res = await request(server).put("/api/users/2000").send({
                fName: "Test",
                lName: "User",
                email: "f@email.com",
                birthday: "2000-01-01",
                gender: "M",
                role: "user",
                password: "12345",
            });
            expect(res.status).toBe(404);
        });

        it("should return 200 if only fName is passed", async () => {
            const res = await request(server).put("/api/users/1000").send({
                fName: "Test",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if only lName is passed", async () => {
            const res = await request(server).put("/api/users/1000").send({
                lName: "User",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if only email is passed", async () => {
            const res = await request(server).put("/api/users/1000").send({
                email: "g@email.com",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if only birthday is passed", async () => {
            const res = await request(server).put("/api/users/1000").send({
                birthday: "2000-01-01",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if only gender is passed", async () => {
            const res = await request(server).put("/api/users/1000").send({
                gender: "M",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if only status is passed", async () => {
            const res = await request(server).put("/api/users/1000").send({
                status: "active",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if only role is passed", async () => {
            const res = await request(server).put("/api/users/1000").send({
                role: "user",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if only password is passed", async () => {
            const res = await request(server).put("/api/users/1000").send({
                password: "12345",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if valid id is passed", async () => {
            const res = await request(server).put("/api/users/1000").send({
                fName: "Test",
                lName: "User",
                email: "f@email.com",
                birthday: "2000-01-01",
                gender: "M",
                role: "user",
                password: "12345",
            });
            expect(res.status).toBe(200);
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
                    "e@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM users;");
        });

        it("should return all users", async () => {
            const res = await request(server).get("/api/users");
            expect(res.status).toBe(200);
        });

        it("should return 404 if no users are found", async () => {
            await sqlCommand("DELETE FROM users;");
            const res = await request(server).get("/api/users");
            expect(res.status).toBe(404);
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
                    "e@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM users;");
        });

        it("should return 404 if no user with the given id exists", async () => {
            const res = await request(server).get("/api/users/2000");
            expect(res.status).toBe(404);
        });

        it("should return 200 if valid id is passed", async () => {
            const res = await request(server).get("/api/users/1000");
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
                    "e@email.com",
                    "2000-01-01",
                    "Male",
                    "user",
                    "12345",
                ]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM users;");
        });

        it("should return 404 if no user with the given id exists", async () => {
            const res = await request(server).delete("/api/users/2000");
            expect(res.status).toBe(404);
        });

        it("should return 200 if valid id is passed", async () => {
            const res = await request(server).delete("/api/users/1000");
            expect(res.status).toBe(200);
        });

        it("should return 500 if user has posts", async () => {
            await sqlCommand(
                "INSERT INTO posts (user, title, body) VALUES (? , ? , ?);",
                [1000, "test", "test"]
            );

            const res = await request(server).delete("/api/users/1000");
            expect(res.status).toBe(500);
        });
    });
});
