import express from "express";
import {
  visualizeParticipantsOfActivity,
  visualizeAllActivities,
  addActivity,
  deleteActivity,
  editActivity,
  listAvailableActivities,
} from "../controllers/activityController.js";
const routes = express.Router();

routes.get("/search?", listAvailableActivities);
routes.get("/", visualizeAllActivities);
routes.get("/:id", visualizeParticipantsOfActivity);
routes.post("/", addActivity);
routes.put("/:id", editActivity);
routes.delete("/:id", deleteActivity);

export default routes;
