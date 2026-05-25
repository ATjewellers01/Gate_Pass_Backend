"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const db_config_1 = require("../../config/db.config");
const loginUser = async (userId, password) => {
    // Simulating the exact logic from old loginApi.js
    const user = await db_config_1.prisma.user.findUnique({
        where: { userId },
    });
    if (!user || user.password !== password) {
        return null;
    }
    // Returning only the fields the frontend expects
    return {
        user_name: user.userName,
        userId: user.userId,
        role: user.role,
        page_access: user.pageAccess,
    };
};
exports.loginUser = loginUser;
