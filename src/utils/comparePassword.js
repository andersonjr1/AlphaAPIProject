import bcrypt from "bcrypt";

// Function to compare a plain-text password with a hashed password
function comparePassword(password, hashedPassword) {
  try {
    // Use bcrypt to compare the plain-text password with the hashed password
    const match = bcrypt.compareSync(password, hashedPassword);
    return match;
  } catch (error) {
    console.error(error);
    return;
  }
}

export { comparePassword };
