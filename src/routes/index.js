import express from "express"
import loginRoutes from "./loginRoutes.js"
import registerRoutes from "./registerRoutes.js"

const routes = express.Router()

routes.use("/register", registerRoutes)
routes.use("/login", loginRoutes)

export default routes