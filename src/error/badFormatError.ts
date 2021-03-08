import { CustomError } from "./customError";

export class BadFormatError extends CustomError {
    constructor(message: string, logInfo: Record<string, unknown>) {
        const options = {
            code: "BAD_FORMAT_ERROR",
            statusCode: 400,
            message,
            logInfo,
        };
        super(options);
    }
}
