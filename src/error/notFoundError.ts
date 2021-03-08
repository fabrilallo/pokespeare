import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
    constructor(message: string, logInfo: Record<string, unknown>) {
        const options = {
            code: "NOT_FOUND_ERROR",
            statusCode: 404,
            message,
            logInfo,
        };
        super(options);
    }
}
