type CustomErrorOptions = {
    code: string;
    statusCode: number;
    message: string;
    logInfo: Record<string, unknown>;
};

export abstract class CustomError extends Error {
    readonly code: string;
    readonly logInfo: Record<string, unknown>;
    readonly statusCode: number;
    readonly message: string;

    constructor(options: CustomErrorOptions) {
        super();
        this.code = options.code;
        this.logInfo = options.logInfo;
        this.statusCode = options.statusCode;
        this.message = options.message;
    }
}
