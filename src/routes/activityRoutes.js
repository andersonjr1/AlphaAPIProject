import express from "express";
import { isAdminApi } from "./isAdmin.js";
import {
  visualizeAllActivities,
  addActivity,
  deleteActivity,
  editActivity,
  listAvailableActivities,
} from "../controllers/activityController.js";
const routes = express.Router();

routes.get("/search?", listAvailableActivities);
routes.use(isAdminApi);
routes.get("/", visualizeAllActivities);
routes.post("/", addActivity);
routes.put("/:id", editActivity);
routes.delete("/:id", deleteActivity);

export default routes;
