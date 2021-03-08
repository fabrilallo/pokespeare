import fastify, { FastifyError } from "fastify";
import { CustomError } from "./error/customError";
import { NotFoundError } from "./error/notFoundError";
import route from "./route/pokespeare";

const app = fastify({
    logger: true,
});

app.setNotFoundHandler((request, reply) => {
    const error = new NotFoundError("Route not found", { url: request.url });

    reply.log.info({ error });

    reply.code(404).send({
        code: error.code,
        message: error.message,
    });
});
app.setErrorHandler((error: FastifyError | Error | CustomError, _request, reply) => {
    reply.log.warn({ error });

    if (error instanceof CustomError) {
        reply.code(error.statusCode).send({
            code: error.code,
            message: error.message,
        });
    } else {
        reply.code(500).send({
            code: "INTERNAL_ERROR",
            message: "The server encountered an internal error",
        });
    }
});

app.register(route);

// Run the server!
const start = async () => {
    try {
        await app.listen(3000);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
