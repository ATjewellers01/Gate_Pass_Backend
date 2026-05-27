"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TABLE_NAMES = exports.ENV_VARS = exports.SUCCESS_MESSAGES = exports.ERROR_MESSAGES = exports.ROUTE_PREFIXES = void 0;
exports.ROUTE_PREFIXES = {
    AUTH: "/api/auth",
    USERS: "/api/users",
    SYSTEM_USERS: "/api/system-users",
    VISITS: "/api/visits",
    DATA: "/api/data",
};
exports.ERROR_MESSAGES = {
    UNAUTHORIZED: "Unauthorized access",
    INVALID_CREDENTIALS: "Invalid username or password. Please try again.",
    VALIDATION_ERROR: "Validation error",
    INTERNAL_SERVER_ERROR: "Internal server error",
    NOT_FOUND: "Resource not found",
};
exports.SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: "Login successful",
    VISIT_CREATED: "Submitted successfully",
    VISIT_APPROVED: "Visit approved",
    VISIT_CLOSED: "Gate pass closed",
};
exports.ENV_VARS = {
    PORT: "PORT",
    DATABASE_URL: "DATABASE_URL",
};
exports.TABLE_NAMES = {
    USERS: "users",
    VISITS: "visits",
};
