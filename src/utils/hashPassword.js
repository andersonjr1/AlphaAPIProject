import bcrypt from "bcrypt";

function hashPassword(password) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error(error);
    return;
  }
}

export { hashPassword };
