import express from "express";
import cookieParser from "cookie-parser";
import { config } from "./config/index.js";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import {
  permissionVerifyRedirect,
  permissionVerify,
} from "./routes/permissionVerify.js";
import {
  redirectHome,
  redirectLogin,
  redirectAvailable,
} from "./utils/redirect.js";
import { isAdminSite, isAdminApi } from "./routes/isAdmin.js";
const port = config.PORT;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(cookieParser());

app.use(express.static(__dirname + "/public"));

app.use("/entrar", redirectHome, express.static(__dirname + "/pages/login"));

app.use(
  "/registrar",
  redirectHome,
  express.static(__dirname + "/pages/register")
);

app.use("/api", routes);

app.use(permissionVerifyRedirect);

app.use("/sair", redirectLogin);

app.use("/disponivel", express.static(__dirname + "/pages/available"));

app.use("/participando", express.static(__dirname + "/pages/participating"));

app.use(permissionVerify, isAdminSite);

app.use("/criar", express.static(__dirname + "/pages/create"));

app.use("/atividades", express.static(__dirname + "/pages/activities"));

app.use(redirectAvailable);

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}/`);
});
