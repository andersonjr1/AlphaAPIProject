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

// Function to authenticate a user
function authenticate(req, res) {
  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password.trim();

  if (!email || !password) {
    return res.status(400).json({ error: "Coloque todos os valores" });
  }

  if (!isValidEmail(email) || !email) {
    return res.status(400).json({ error: "Coloque um email válido" });
  }

  if (!isValidPassword(password) || !password) {
    return res.status(400).json({ error: "Coloque uma senha válida" });
  }

  // Find the user in the database by email
  userDataBase.findByValue(email, "email", (error, data) => {
    if (error) {
      return res.status(500).json({ error: "Erro interno no servidor" });
    }

    if (!data) {
      return res.status(401).json({ error: "O usuário não existe" });
    }

    if (!comparePassword(password, data.value.password)) {
      return res.status(401).json({ error: "Senha errada" });
    }

    // If authentication is successful, create a JWT
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

    res.status(200).json({
      id: data.key,
      email: data.value.email,
      name: data.value.name,
      admin: data.value.admin,
    });
  });
}

// Function to create a new user account
function createAccount(req, res) {
  const email = req.body.email.trim().toLowerCase();
  let password = req.body.password.trim();
  const name = req.body.name.trim();

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Coloque todos os valores" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Coloque um email válido" });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({ error: "Coloque uma senha válida" });
  }

  if (!isValidName(name)) {
    return res.status(400).json({ error: "Coloque um nome válida" });
  }

  const id = uuidv6();

  password = hashPassword(password);

  // Check if a user with the same email already exists
  userDataBase.findByValue(email, "email", (error, data) => {
    if (error) {
      return res.status(500).json({ error: "Erro interno no servidor" });
    }

    if (data) {
      return res.status(401).json({ error: "O usuário já existe" });
    }

    // If the user does not exist, create a new user in the database
    try {
      userDataBase.put(
        id,
        JSON.stringify({ email, password, name, admin: false }),
        (error) => {
          if (error) {
            return res.status(500).json({ error: "Erro interno no servidor" });
          }

          // Create a JWT for the new user
          const signature = jwt.sign(
            { id, email, name, admin: false },
            SECRET_KEY,
            { expiresIn: "7d" }
          );
          res.cookie("SESSION_ID", signature, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          });
          return res.status(201).json({ id, email, name, admin: false });
        }
      );
    } catch (error) {
      console.error(error.message);
    }
  });
}

export { authenticate, createAccount, userDataBase };
