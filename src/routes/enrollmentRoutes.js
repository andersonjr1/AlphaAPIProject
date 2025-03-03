import express from "express";
import {
  unenrollActivity,
  enrollActivity,
} from "../controllers/enrollmentController.js";
const routes = express.Router();

routes.post("/", enrollActivity);
routes.delete("/", unenrollActivity);

export default routes;
