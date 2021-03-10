import { CustomError } from "./customError";

export class RateLimitError extends CustomError {
    constructor(message: string, logInfo: Record<string, unknown>) {
        const options = {
            code: "RATE_LIMIT_ERROR",
            statusCode: 429,
            message,
            logInfo,
        };
        super(options);
    }
}
