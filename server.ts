import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config';
import { ROUTE_PREFIXES, ENV_VARS } from './utils/constants';

// Routes
import authRoutes from './features/auth/auth.routes';
import userRoutes from './features/user/user.routes';
import systemUsersRoutes from './features/system-users/system-users.routes';
import visitRoutes from './features/visit/visit.routes';
import dataRoutes from './features/data/data.routes';

dotenv.config();

const app = express();
const PORT = process.env[ENV_VARS.PORT] || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Database connection
connectDB();

// Route registration
app.use(ROUTE_PREFIXES.AUTH, authRoutes);
app.use(ROUTE_PREFIXES.USERS, userRoutes);
app.use(ROUTE_PREFIXES.SYSTEM_USERS, systemUsersRoutes);
app.use(ROUTE_PREFIXES.VISITS, visitRoutes);
app.use(ROUTE_PREFIXES.DATA, dataRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
