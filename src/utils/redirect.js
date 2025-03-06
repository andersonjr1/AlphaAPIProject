import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
const secretKey = config.SECRET_KEY;

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
    console.error(error);
    return next();
  }
}

function redirectLogin(req, res) {
  res.cookie("SESSION_ID", "", {
    expires: new Date(0),
    httpOnly: true,
  });

  res.redirect("/entrar");
}

function redirectAvailable(req, res) {
  res.redirect("/disponivel");
}

export { redirectHome, redirectLogin, redirectAvailable };
