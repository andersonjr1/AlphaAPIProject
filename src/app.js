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
import { isAdminSite, isAdminApi } from "./routes/isAdmin.js";
const port = config.PORT;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(cookieParser());

app.use("/entrar", express.static(__dirname + "/pages/login"));

app.use("/registrar", express.static(__dirname + "/pages/register"));

app.use("/api", routes);

app.use(permissionVerifyRedirect);

app.use("/sair", (req, res) => {
  res.cookie("SESSION_ID", "", {
    expires: new Date(0),
    httpOnly: true,
  });

  res.send(
    "<script>window.location.href =  'http://localhost:4000/' + 'entrar';</script>"
  );
});

app.use("/disponivel", express.static(__dirname + "/pages/available"));

app.use("/participando", express.static(__dirname + "/pages/participating"));

app.use(permissionVerify, isAdminSite);

app.use("/admin", express.static(__dirname + "/pages/admin"));

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}/`);
});
