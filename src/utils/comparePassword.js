import bcrypt from "bcrypt";

function comparePassword(password, hashedPassword) {
  try {
    const match = bcrypt.compareSync(password, hashedPassword);
    return match;
  } catch (error) {
    console.error(error);
    return;
  }
}

export { comparePassword };
