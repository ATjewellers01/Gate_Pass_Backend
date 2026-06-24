"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = require("./config/db.config");
const constants_1 = require("./utils/constants");
// Routes
const auth_routes_1 = __importDefault(require("./features/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./features/user/user.routes"));
const system_users_routes_1 = __importDefault(require("./features/system-users/system-users.routes"));
const visit_routes_1 = __importDefault(require("./features/visit/visit.routes"));
const data_routes_1 = __importDefault(require("./features/data/data.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env[constants_1.ENV_VARS.PORT] || 5000;
// Middleware
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json({ limit: '10mb' }));
// Database connection
(0, db_config_1.connectDB)();
// Route registration
app.use(constants_1.ROUTE_PREFIXES.AUTH, auth_routes_1.default);
app.use(constants_1.ROUTE_PREFIXES.USERS, user_routes_1.default);
app.use(constants_1.ROUTE_PREFIXES.SYSTEM_USERS, system_users_routes_1.default);
app.use(constants_1.ROUTE_PREFIXES.VISITS, visit_routes_1.default);
app.use(constants_1.ROUTE_PREFIXES.DATA, data_routes_1.default);
app.get("/", (req, res) => {
    console.log("CI/CD Pipeline Test - June 2026");
    res.send("Welcome to AT Jwellers Gate Pass Backend API");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
