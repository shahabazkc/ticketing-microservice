"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const custom_err_1 = require("./custom-err");
class NotFoundError extends custom_err_1.CustomError {
    constructor() {
        super("Route not found");
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: "Not Found" }];
    }
}
exports.NotFoundError = NotFoundError;
