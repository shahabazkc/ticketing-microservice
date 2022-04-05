import { CustomError } from "./custom-err";
export declare class DatabaseConnectionError extends CustomError {
    reason: string;
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
