"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const auth_service_1 = require("./auth.service");
const constants_1 = require("../../utils/constants");
const login = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await (0, auth_service_1.loginUser)(userId, password);
        if (!user) {
            return res.status(401).json({ error: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS });
        }
        return res.status(200).json({
            message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
            data: user
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.login = login;
