"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserHandler = exports.updateUserHandler = exports.createUserHandler = exports.fetchUsers = void 0;
const system_users_service_1 = require("./system-users.service");
const constants_1 = require("../../utils/constants");
const fetchUsers = async (req, res) => {
    try {
        const users = await (0, system_users_service_1.getAllSystemUsers)();
        return res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        console.error('Fetch users error:', error);
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.fetchUsers = fetchUsers;
const createUserHandler = async (req, res) => {
    try {
        const user = await (0, system_users_service_1.createSystemUser)(req.body);
        return res.status(201).json({ success: true, data: user });
    }
    catch (error) {
        console.error('Create user error:', error);
        if (error?.code === 'P2002') {
            return res.status(400).json({ error: 'User ID already exists. Please choose a different one.' });
        }
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, details: error.message });
    }
};
exports.createUserHandler = createUserHandler;
const updateUserHandler = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: 'Invalid ID' });
        const user = await (0, system_users_service_1.updateSystemUser)(id, req.body);
        return res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        console.error('Update user error:', error);
        if (error?.code === 'P2002') {
            return res.status(400).json({ error: 'User ID already exists. Please choose a different one.' });
        }
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, details: error.message });
    }
};
exports.updateUserHandler = updateUserHandler;
const deleteUserHandler = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: 'Invalid ID' });
        await (0, system_users_service_1.deleteSystemUser)(id);
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.deleteUserHandler = deleteUserHandler;
