import express from "express";
import {
  unenrollActivity,
  enrollActivity,
  querySearch,
} from "../controllers/enrollmentController.js";
const routes = express.Router();

routes.get("/search?", querySearch);
routes.post("/", enrollActivity);
routes.delete("/", unenrollActivity);

export default routes;
