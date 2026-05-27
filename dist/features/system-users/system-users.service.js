"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSystemUser = exports.updateSystemUser = exports.createSystemUser = exports.getAllSystemUsers = void 0;
const db_config_1 = require("../../config/db.config");
const getAllSystemUsers = async () => {
    return await db_config_1.prisma.user.findMany({
        select: {
            id: true,
            userName: true,
            phone: true,
            role: true,
            pageAccess: true,
            createdAt: true
        }
    });
};
exports.getAllSystemUsers = getAllSystemUsers;
const createSystemUser = async (data) => {
    return await db_config_1.prisma.user.create({
        data: {
            userName: data.userName,
            password: data.password,
            phone: data.phone,
            role: data.role || 'Staff',
            pageAccess: data.pageAccess || ''
        }
    });
};
exports.createSystemUser = createSystemUser;
const updateSystemUser = async (id, data) => {
    const updateData = {};
    if (data.userName !== undefined)
        updateData.userName = data.userName;
    if (data.password !== undefined)
        updateData.password = data.password;
    if (data.phone !== undefined)
        updateData.phone = data.phone;
    if (data.role !== undefined)
        updateData.role = data.role;
    if (data.pageAccess !== undefined)
        updateData.pageAccess = data.pageAccess;
    return await db_config_1.prisma.user.update({
        where: { id },
        data: updateData
    });
};
exports.updateSystemUser = updateSystemUser;
const deleteSystemUser = async (id) => {
    return await db_config_1.prisma.user.delete({
        where: { id }
    });
};
exports.deleteSystemUser = deleteSystemUser;
