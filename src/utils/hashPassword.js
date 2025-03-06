import bcrypt from "bcrypt";

// Function to hash a plain-text password
function hashPassword(password) {
  try {
    // Generate a salt (a random string) to add to the password before hashing
    const salt = bcrypt.genSaltSync(10); // The number 10 represents the salt rounds (complexity of the hash)
    // Hash the password using the generated salt
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error(error);
    return;
  }
}

export { hashPassword };
