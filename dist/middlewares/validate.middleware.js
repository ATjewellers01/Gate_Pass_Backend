"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const constants_1 = require("../utils/constants");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    error: constants_1.ERROR_MESSAGES.VALIDATION_ERROR,
                    details: error.issues,
                });
            }
            return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    };
};
exports.validate = validate;
