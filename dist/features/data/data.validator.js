"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDataSchema = exports.createDataSchema = void 0;
const zod_1 = require("zod");
exports.createDataSchema = zod_1.z.object({
    body: zod_1.z.object({
        personToMeet: zod_1.z.string().min(1, 'Person name is required'),
        phone: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
    })
});
exports.updateDataSchema = zod_1.z.object({
    body: zod_1.z.object({
        personToMeet: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
    })
});
