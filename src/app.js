import express from "express"
import cookieParser from "cookie-parser"
import {config} from "./config/index.js"
import routes from "./routes/index.js"
const port = config.PORT
const app = express()

app.use(express.json())

app.use(cookieParser())

app.use("/api", routes)

app.listen(port, () => {
    console.log(`Servidor está rodando em http://localhost:${port}/`)
})