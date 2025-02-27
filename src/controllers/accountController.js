import { DataBase } from "../database/index.js";
import { v6 as uuidv6 } from "uuid";
const userDataBase = new DataBase("user");

function authenticate(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  userDataBase.findByValue(email, "email", (error, data) => {
    if (error) {
      return res.status(500).json("Error in the iterator");
    }

    if (!data) {
      return res.status(400).json("The user doesn't exist");
    }

    // Still needs to hash password

    if (!(data.value.password === password)) {
      return res.status(400).json("Wrong password");
    }

    res.status(200).json("Success");
  });
}

function createAccount(req, res) {
  const email = req.body.email;
  let password = req.body.password;
  const name = req.body.name;
  const id = uuidv6();

  // Still needs to validade data

  userDataBase.findByValue(email, "email", (error, data) => {
    if (error) {
      return res.status(500).json("Error in the iterator");
    }

    if (data) {
      return res.status(403).json("The user already exists");
    }

    // Still needs to hash password

    userDataBase.put(id, JSON.stringify({ email, password, name }), (error) => {
      if (error) {
        return res.status(500).json("Error trying to create account");
      }

      return res
        .status(201)
        .json({ key: id, value: { email, password, name } });
    });
  });
}

export { authenticate, createAccount };
