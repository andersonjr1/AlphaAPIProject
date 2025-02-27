import express from "express"
import { authenticate } from "../controllers/accountController.js"
const routes = express.Router()

routes.post("/", authenticate)

export default routes