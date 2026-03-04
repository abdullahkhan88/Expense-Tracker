import {Router} from "express";

import {AdminUserGuard} from "../middleware/guard.middleware.js";
import { getReports } from "./dashboard.controller.js";

const DashboardRouter = Router();

DashboardRouter.get('/report',AdminUserGuard,getReports);

export default DashboardRouter;