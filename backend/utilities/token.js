const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const yup = require("yup");
require("dotenv").config();
const { users } = require("../db/dbmodel");

async function userHash(body) {
  try {
    const newPassword = await bcrypt.hash(body.password, 10);
    const isExist = await users.findAll({ where: { email: body.email } });
    if (isExist.length == 0) {
      body.password = newPassword;
      return users
        .create(body)
        .then()
        .catch((err) => console.log(err));
    } else {
      return;
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
}

async function tokenSign(email, password) {
  const user = await users.findOne({ where: { email: email } });
  const hash = user.dataValues.password;
  const isValid = await bcrypt.compare(password, hash);
  if (isValid) {
    const id = user.dataValues.id;
    const role = user.dataValues.role;
    const mytoken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return mytoken;
  }
  return;
}

module.exports = { userHash, tokenSign };
