"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1, 'Username (userId) is required'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
