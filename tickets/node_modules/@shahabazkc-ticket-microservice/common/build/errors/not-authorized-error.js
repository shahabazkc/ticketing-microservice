"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizedError = void 0;
const custom_err_1 = require("./custom-err");
class NotAuthorizedError extends custom_err_1.CustomError {
    constructor() {
        super("Not authorized");
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors() {
        return [
            { message: "Not authorized" }
        ];
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
