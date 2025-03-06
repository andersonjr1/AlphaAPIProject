import dotenv from "dotenv";
dotenv.config();

// Create a configuration object to store environment-specific settings
const config = {
  // Set the PORT to the value of the environment variable PORT, or default to 3000 if not provided
  PORT: process.env.PORT || 3000,

  // Set the SECRET_KEY to the value of the environment variable SECRET_KEY, or use a fallback insecure key if not provided
  SECRET_KEY: process.env.SECRET_KEY || "THIS_IS_NOT_A_SECURE_SECRET_KEY",
};

export { config };
