import { FastifyInstance } from "fastify";

import { getPokespeareController } from "../controller/pokespeareController";

export default async function (fastify: FastifyInstance): Promise<void> {
    fastify.get("/pokemon/:name", getPokespeareController);
}
