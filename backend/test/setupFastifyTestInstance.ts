// setupFastifyTestInstance.ts
import Fastify from "fastify";
import { DataSource } from "typeorm";
import fastifySecureSession from "@fastify/secure-session";
import logPlugin from "../src/plugins/logAction";
import { readFileSync } from "fs";
import path from "path";

// Function to set up the Fastify instance for testing
export async function setupFastifyTestInstance(routes: any, mockEntities: any) {
    const fastify = Fastify();

    // Mock DataSource with entities
    const mockDataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
    });

    // Mock the getRepository method of the mockDataSource
    const repository = {
        count: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getOne: jest.fn(),
        }),
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    (mockDataSource.getRepository as jest.Mock).mockReturnValue(repository);

    fastify.decorate("dataSource", mockDataSource);

    fastify.register(fastifySecureSession, {
        sessionName: "axSession",
        cookieName: "ax-session-cookie",
        key: readFileSync(path.join(__dirname, "../secret-key")),
        expiry: 60 * 60,
        cookie: {
            path: "/",
            httpOnly: true,
        },
    });

    fastify.register(logPlugin);
    await fastify.register(routes);

    await fastify.ready();
    return fastify;
}
