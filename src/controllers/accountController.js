import { userDataBase } from "../database/index.js";
import { config } from "../config/index.js";
import { v6 as uuidv6 } from "uuid";
import jwt from "jsonwebtoken";
import { hashPassword } from "../utils/hashPassword.js";
import { comparePassword } from "../utils/comparePassword.js";
import {
  isValidEmail,
  isValidPassword,
  isValidName,
} from "../utils/validate.js";

const SECRET_KEY = config.SECRET_KEY;

function authenticate(req, res) {
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  if (!email || !password) {
    return res.status(400).json("Please enter all values");
  }

  if (!isValidEmail(email) || !email) {
    return res.status(400).json("Please enter a valid email");
  }

  if (!isValidPassword(password) || !password) {
    return res.status(400).json("Please enter a valid password");
  }

  userDataBase.findByValue(email, "email", (error, data) => {
    if (error) {
      return res.status(500).json("Error in the iterator");
    }

    if (!data) {
      return res.status(400).json("The user doesn't exist");
    }

    if (!comparePassword(password, data.value.password)) {
      return res.status(400).json("Wrong password");
    }

    const signature = jwt.sign(
      {
        id: data.key,
        email: data.value.email,
        name: data.value.name,
        admin: data.value.admin,
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("SESSION_ID", signature, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.status(200).json("Success");
  });
}

function createAccount(req, res) {
  const email = req.body.email.trim();
  let password = req.body.password.trim();
  const name = req.body.name.trim();

  if (!email || !password || !name) {
    return res.status(400).json("Please enter all values");
  }

  if (!isValidEmail(email)) {
    return res.status(400).json("Please enter a valid email");
  }

  if (!isValidPassword(password)) {
    return res.status(400).json("Please enter a valid password");
  }

  if (!isValidName(name)) {
    return res.status(400).json("Please enter a valid name");
  }

  const id = uuidv6();

  password = hashPassword(password);

  userDataBase.findByValue(email, "email", (error, data) => {
    if (error) {
      return res.status(500).json("Error in the iterator");
    }

    if (data) {
      return res.status(403).json("The user already exists");
    }

    userDataBase.put(
      id,
      JSON.stringify({ email, password, name, admin: false }),
      (error) => {
        if (error) {
          return res.status(500).json("Error trying to create account");
        }

        const signature = jwt.sign(
          { id, email, name, admin: false },
          SECRET_KEY,
          { expiresIn: "7d" }
        );
        res.cookie("SESSION_ID", signature, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        });
        return res
          .status(201)
          .json({ key: id, value: { email, password, name } });
      }
    );
  });
}

export { authenticate, createAccount, userDataBase };
