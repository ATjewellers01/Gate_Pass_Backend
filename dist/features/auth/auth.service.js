"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const db_config_1 = require("../../config/db.config");
const loginUser = async (phone, password) => {
    const user = await db_config_1.prisma.user.findUnique({
        where: { phone },
    });
    if (!user || user.password !== password) {
        return null;
    }
    // Returning only the fields the frontend expects
    return {
        user_name: user.userName,
        phone: user.phone,
        role: user.role,
        page_access: user.pageAccess,
    };
};
exports.loginUser = loginUser;
