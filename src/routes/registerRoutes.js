import express from "express"
import { createAccount } from "../controllers/accountController.js"
const routes = express.Router()

routes.post("/", createAccount)

export default routes