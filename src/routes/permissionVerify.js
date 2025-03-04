import { config } from "../config/index.js";
import jwt from "jsonwebtoken";

const secretKey = config.SECRET_KEY;

//Se a pessoa estiver logada ela vai pro login

function permissionVerifyRedirect(req, res, next) {
  const session_id = req.cookies.SESSION_ID;
  if (!session_id) {
    return res.send(
      "<script>window.location.href =  'http://localhost:4000/' + 'entrar';</script>"
    );
  }

  try {
    jwt.verify(session_id, secretKey, (err, decoded) => {
      if (err) {
        return res.send(
          "<script>window.location.href = 'http://localhost:4000/' + 'entrar';</script>"
        );
      }
      next();
    });
  } catch (error) {
    console.err(error);
    return res.send(
      "<script>window.location.href = 'http://localhost:4000/' + 'entrar';</script>"
    );
  }
}

function permissionVerify(req, res, next) {
  const session_id = req.cookies.SESSION_ID;
  if (!session_id) {
    return res.status(403).json({ error: "Precisar logar" });
  }

  try {
    jwt.verify(session_id, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Jwt inválido" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.err(error);
    if (!session_id) {
      return res.status(403).json({ error: "Jwt inválido" });
    }
  }
}

export { permissionVerifyRedirect, permissionVerify };
