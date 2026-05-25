"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePersonSchema = exports.createPersonSchema = void 0;
const zod_1 = require("zod");
exports.createPersonSchema = zod_1.z.object({
    body: zod_1.z.object({
        personToMeet: zod_1.z.string().min(2, "Name must be at least 2 characters"),
        phone: zod_1.z.string().optional(),
        password: zod_1.z.string().optional()
    })
});
exports.updatePersonSchema = zod_1.z.object({
    body: zod_1.z.object({
        personToMeet: zod_1.z.string().min(2, "Name must be at least 2 characters").optional(),
        phone: zod_1.z.string().optional(),
        password: zod_1.z.string().optional()
    })
});
