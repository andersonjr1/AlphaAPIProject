import { config } from "../config/index.js";
import jwt from "jsonwebtoken";

const secretKey = config.SECRET_KEY;

// Middleware function to verify user permissions and redirect if unauthorized
function permissionVerifyRedirect(req, res, next) {
  const session_id = req.cookies.SESSION_ID;
  if (!session_id) {
    return res.redirect("/entrar");
  }

  try {
    // Verify the session ID (JWT) using the secret key
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

// Middleware function to verify user permissions and return an error if unauthorized
function permissionVerify(req, res, next) {
  const session_id = req.cookies.SESSION_ID;
  if (!session_id) {
    return res.status(403).json({ error: "Precisar logar" });
  }

  try {
    // Verify the session ID (JWT) using the secret key
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
