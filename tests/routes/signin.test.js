const request = require("supertest");

describe("/api/signin", () => {
    let server;

    beforeEach(() => {
        server = require("../../index");
    });

    afterEach(() => {
        server.close();
    });

    describe("POST /", () => {
        it("should return 400 if missed a value", async () => {
            const res = await request(server).post("/api/signin").send({
                email: "e@email.com",
            });
            expect(res.status).toBe(400);
        });

        it("should return 400 if invalid id is passed", async () => {
            const res = await request(server).post("/api/signin").send({
                id: "e",
                password: "123456",
            });
            expect(res.status).toBe(400);
        });

        it("should return 400 if no user with the given id exists", async () => {
            const res = await request(server).post("/api/signin").send({
                id: 999,
                password: "123456",
            });
            expect(res.status).toBe(400);
        });

        it("should return 400 if invalid password is passed", async () => {
            const res = await request(server).post("/api/signin").send({
                id: 1,
                password: "1234567",
            });
            expect(res.status).toBe(400);
        });

        it("should return 200 if valid id and password is passed", async () => {
            const res = await request(server).post("/api/signin").send({
                id: 1,
                password: "1234",
            });
            expect(res.status).toBe(200);
        });
    });
});
