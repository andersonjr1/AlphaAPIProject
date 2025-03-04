import { config } from "../config/index.js";
import jwt from "jsonwebtoken";

const secretKey = config.SECRET_KEY;

//Se a pessoa estiver logada ela vai pro login

function permissionVerifyRedirect(req, res, next) {
  const session_id = req.cookies.SESSION_ID;
  if (!session_id) {
    return res.redirect("/entrar");
  }

  try {
    jwt.verify(session_id, secretKey, (err, decoded) => {
      if (err) {
        return res.redirect("/entrar");
      }
      next();
    });
  } catch (error) {
    console.err(error);
    return res.redirect("/entrar");
  }
}

function redirectHome(req, res, next) {
  const session_id = req.cookies.SESSION_ID;
  if (!session_id) {
    return next();
  }

  try {
    jwt.verify(session_id, secretKey, (err, decoded) => {
      if (err) {
        return next();
      }
      return res.redirect("/");
    });
  } catch (error) {
    console.err(error);
    return next();
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

export { permissionVerifyRedirect, permissionVerify, redirectHome };
