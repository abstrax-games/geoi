import { FastifyInstance } from "fastify";
import { Geoi } from "../models";
import { withPrivilegeCheck } from "../middlewares/checkPrivilege";
import PrivilegeChecker from "../utils/privilege";

interface GeoiAddRequest {
    content: string;
    type: string;
    source: string;
}

export default async function geoiRoutes(fastify: FastifyInstance) {
    // Repository
    const geoiRepository = fastify.dataSource.getRepository(Geoi);

    // get one geoi by random
    fastify.get("/", async (request, reply) => {
        const total = await geoiRepository.count();
        const randomOffset = Math.floor(Math.random() * total);
        const geoi = await geoiRepository
            .createQueryBuilder()
            .skip(randomOffset)
            .take(1)
            .getOne();

        return geoi;
    });

    function lengthChecker(
        content: string,
        minLength: number = 1,
        maxLength: number = 20
    ): boolean {
        if (content.length < minLength || content.length > maxLength) {
            return false;
        }
        return true;
    }

    // add a new geoi
    fastify.post<{ Body: GeoiAddRequest }>(
        "/add",
        {
            preHandler: withPrivilegeCheck(PrivilegeChecker.ADD_GEOI),
        },
        async (request, reply) => {
            const { content, type, source } = request.body;

            if (!lengthChecker(content, 1, 100)) {
                reply
                    .code(400)
                    .send("Content length should be between 1 and 100.");
                return;
            }

            if (!lengthChecker(type, 1, 20)) {
                reply.code(400).send("Type length should be between 1 and 20.");
                return;
            }

            if (!lengthChecker(source, 1, 20)) {
                reply
                    .code(400)
                    .send("Source length should be between 1 and 20.");
                return;
            }

            const geoi = geoiRepository.create();
            geoi.content = content;
            geoi.type = type;
            geoi.source = source;
            geoi.creator = request.user;

            try {
                await geoiRepository.save(geoi);
            } catch (e) {
                reply.code(500).send("Failed to save geoi.");
                return;
            }
        }
    );

    // Delete a geoi by id
    fastify.post<{ Body: { id: number } }>(
        "/delete",
        {
            preHandler: withPrivilegeCheck(PrivilegeChecker.MANAGE_GEOI),
        },
        async (request, reply) => {
            const { id } = request.body;

            if (isNaN(id)) {
                reply.code(400).send("Invalid id.");
                return;
            }

            const geoi = await geoiRepository.findOne({
                where: { id },
            });

            if (!geoi) {
                reply.code(404).send("Geoi not found.");
                return;
            }

            try {
                await geoiRepository.remove(geoi);
            } catch (e) {
                reply.code(500).send("Failed to delete geoi.");
                return;
            }
        }
    );
}
