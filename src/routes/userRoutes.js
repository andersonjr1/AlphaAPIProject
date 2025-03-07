import express from "express";
import { querySearch } from "../controllers/userController.js";
const routes = express.Router();
import { isAdminApi } from "./isAdmin.js";

routes.use(isAdminApi);
routes.get("/search?", querySearch);

export default routes;
