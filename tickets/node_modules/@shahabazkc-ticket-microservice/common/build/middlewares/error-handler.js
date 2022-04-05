"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_err_1 = require("../errors/custom-err");
const errorHandler = (err, req, res, next) => {
    if (err instanceof custom_err_1.CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    res.status(400).send({
        errors: [
            { message: 'Something went wrong' }
        ]
    });
};
exports.errorHandler = errorHandler;
