const { userHash, tokenSign } = require("../utilities/token");
const { checkCredentials } = require("../utilities/validator");

// function to register/signup the user into users table and password hashing
async function signup(req, res) {
  try {
    const formFill = await checkCredentials(req.body);
    const result = await userHash(req.body);
    result
      ? res.status(200).json({ message: `signup successfull` })
      : res.status(400).json({ message: `this email is already used` });
  } catch (error) {
    return res.status(403).json(error.errors || error);
  }
}

// function to login user and token generation
async function login(req, res) {
  try {
    if (req.body.email && req.body.password) {
      const email = req.body.email;
      const password = req.body.password;
      const result = await tokenSign(email, password);
      if (result) {
        res.setHeader("Authorization", `Bearer ${result}`);
        return res
          .status(200)
          .json({ message: `login successfull`, key: result });
      } else {
        return res.status(401).json({ message: `invalid password` });
      }
    } else {
      return res.status(400).json({ message: `enter both email and password` });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
}

module.exports = { signup, login };
