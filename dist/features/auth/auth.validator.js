"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string().min(1, 'Phone number is required'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
