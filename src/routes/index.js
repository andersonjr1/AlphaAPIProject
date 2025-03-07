import express from "express";
import loginRoutes from "./loginRoutes.js";
import registerRoutes from "./registerRoutes.js";
import enrollmentRoutes from "./enrollmentRoutes.js";
import activityRoutes from "./activityRoutes.js";
import userRoutes from "./userRoutes.js";
import { permissionVerify } from "./permissionVerify.js";

const routes = express.Router();

routes.use("/register", registerRoutes);
routes.use("/login", loginRoutes);
routes.use(permissionVerify);
routes.use("/user", userRoutes);
routes.use("/enrollment", enrollmentRoutes);
routes.use("/activity", activityRoutes);

export default routes;
