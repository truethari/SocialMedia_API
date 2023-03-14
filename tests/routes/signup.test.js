const request = require("supertest");

describe("/api/signin", () => {
    let server;

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
                "INSERT INTO users (id, fName, lName, email, password) VALUES (? , ? , ? , ? , ?);",
                [1000, "test", "name", "e@email.com", "12345"]
            );
        });

        afterEach(async () => {
            await sqlCommand("DELETE FROM users;");
        });

        it("should return 400 if invalid body is passed", async () => {
            const res = await request(server).post("/api/signup");
            expect(res.status).toBe(400);
        });

        it("should return 400 if invalid fName is passed", async () => {
            const res = await request(server).post("/api/signup").send({
                fName: "e",
                lName: "name",
                email: "f@email.com",
                password: "1234",
            });
            expect(res.status).toBe(400);
        });

        it("should return 400 if email already exists", async () => {
            const res = await request(server).post("/api/signup").send({
                fName: "name",
                lName: "name",
                email: "e@email.com",
                password: "1234",
            });
            expect(res.status).toBe(400);
        });

        it("should return 200 only required fields are passed", async () => {
            const res = await request(server).post("/api/signup").send({
                fName: "name",
                lName: "name",
                email: "g@email.com",
                password: "1234",
            });
            expect(res.status).toBe(200);
        });

        it("should return 200 if all fields are passed", async () => {
            const res = await request(server).post("/api/signup").send({
                fName: "name",
                lName: "name",
                email: "h@email.com",
                birthday: "2000-01-01",
                gender: "M",
                status: "active",
                role: "admin",
                password: "1234",
            });
            expect(res.status).toBe(200);
        });
    });
});
