"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_validator_1 = require("./auth.validator");
const router = (0, express_1.Router)();
router.post('/login', (0, validate_middleware_1.validate)(auth_validator_1.loginSchema), auth_controller_1.login);
exports.default = router;
