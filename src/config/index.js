import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY || "THIS_IS_NOT_A_SECURE_SECRET_KEY",
};

export { config };
