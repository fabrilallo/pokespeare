import { CustomError } from "./customError";

export class InternalError extends CustomError {
    constructor(message: string, logInfo: Record<string, unknown>) {
        const options = {
            code: "INTERNAL_ERROR",
            statusCode: 500,
            message,
            logInfo,
        };
        super(options);
    }
}
