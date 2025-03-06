import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
const secretKey = config.SECRET_KEY;

// Middleware function to redirect authenticated users to the home page
function redirectHome(req, res, next) {
  const session_id = req.cookies.SESSION_ID;
  if (!session_id) {
    return next();
  }
  try {
    // Verify the session ID (JWT) using the secret key
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

// Function to log out a user by clearing the session cookie and redirecting to the login page
function redirectLogin(req, res) {
  // Clear the session cookie by setting it to an empty value and expiring it immediately
  res.cookie("SESSION_ID", "", {
    expires: new Date(0),
    httpOnly: true,
  });

  res.redirect("/entrar");
}

// Function to redirect the user to the "available" page
function redirectAvailable(req, res) {
  res.redirect("/disponivel");
}

export { redirectHome, redirectLogin, redirectAvailable };
