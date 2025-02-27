import express from "express"
import {config} from "./config/index.js"
const port = config.PORT
const app = express()

app.listen(port, () => {
    console.log(`Servidor está rodando em http://localhost:${port}/`)
})