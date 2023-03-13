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
            const res = await request(server).post("/api/signup");
            expect(res.status).toBe(400);
        });

        it("should return 400 if invalid fName is passed", async () => {
            const res = await request(server).post("/api/signup").send({
                fName: "e",
                lName: "name",
                email: "e@email.com",
                birthday: "2000-12-06",
                gender: "M",
                password: "1234",
            });
            expect(res.status).toBe(400);
        });

        it("should return 200 if valid details are passed", async () => {
            const res = await request(server).post("/api/signup").send({
                fName: "Tharindu",
                lName: "Nayanajith",
                email: "fff@tharindu.dev",
                birthday: "2000-12-06",
                gender: "M",
                password: "1234",
            });
            expect(res.status).toBe(200);
        });
    });
});
