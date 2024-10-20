// geoiRoute.test.ts
import { setupFastifyTestInstance } from "./setupFastifyTestInstance";
import geoiRoutes from "../src/routes/geoi";
import { Geoi } from "../src/models";
import supertest from "supertest";
import { withPrivilegeCheck } from "../src/middlewares/checkPrivilege";
import PrivilegeChecker from "../src/utils/privilege";
import { mockSessionAndPrivilege } from "./mockSessionAndPrivilege";

describe("geoiRoutes", () => {
    let fastify: any;

    beforeEach(async () => {
        fastify = await setupFastifyTestInstance(geoiRoutes, [Geoi]);
    });

    afterEach(async () => {
        await fastify.close();
        jest.clearAllMocks();
    });

    it("GET / should return a random geoi", async () => {
        const mockGeoi = {
            id: 1,
            content: "Test Content",
            type: "Test Type",
            source: "Test Source",
        };

        const geoiRepository = fastify.dataSource.getRepository(Geoi);
        geoiRepository.count.mockResolvedValue(10);
        geoiRepository.createQueryBuilder().getOne.mockResolvedValue(mockGeoi);

        const response = await supertest(fastify.server).get("/");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockGeoi);
        expect(geoiRepository.count).toHaveBeenCalledTimes(1);
        expect(geoiRepository.createQueryBuilder().skip).toHaveBeenCalledWith(
            expect.any(Number)
        );
        expect(geoiRepository.createQueryBuilder().take).toHaveBeenCalledWith(
            1
        );
        expect(
            geoiRepository.createQueryBuilder().getOne
        ).toHaveBeenCalledTimes(1);
    });

    it("POST /add should add a new geoi with valid data", async () => {
        const user = { user: "test", privileges: [PrivilegeChecker.ADD_GEOI] };
        mockSessionAndPrivilege(user, PrivilegeChecker.ADD_GEOI);

        const requestPayload = {
            content: "Test Content",
            type: "Test Type",
            source: "Test Source",
        };

        const geoiRepository = fastify.dataSource.getRepository(Geoi);
        geoiRepository.create.mockReturnValue(requestPayload);
        geoiRepository.save.mockResolvedValue(requestPayload);

        const response = await supertest(fastify.server)
            .post("/add")
            .send(requestPayload)
            .expect(200);

        expect(geoiRepository.create).toHaveBeenCalledWith(
            expect.objectContaining(requestPayload)
        );
        expect(geoiRepository.save).toHaveBeenCalledWith(
            expect.objectContaining(requestPayload)
        );
    });
});
