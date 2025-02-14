const { users } = require("../db/dbmodel");
const { updateProfile } = require("../utilities/validator");
const bcrypt = require("bcrypt");

async function home(req, res) {
  return res.status(200).json({ message: `welcome to Ecommerce project` });
}

// both customer and admin can update their profile
async function updateUserProfile(req, res) {
  try {
    const user = req.user;
    const validInfo = await updateProfile(req.body);
    const dataBody = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    };
    const update = await users.update(dataBody, {
      where: { id: user.id },
    });
    success = "user updated successfully";
    return res.status(200).json({ success });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

//both customer and admin can get their profile
async function getUserProfile(req, res) {
  try {
    const userProfile = await users.findByPk(req.user.id, {
      attributes: ["first_name", "last_name", "email", "role"],
    });
    return res.status(200).json(userProfile.dataValues);
  } catch (error) {
    return res.status(400).json({ error });
  }
}

// function to get list of all users from users table
async function getAllUsers(req, res) {
  try {
    if (req.user.role != "admin") {
      return res.status(402).json({ message: `invalid role` });
    }
    const getList = await users.findAll();
    return res.status(200).json({ getList });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

module.exports = { home, updateUserProfile, getUserProfile, getAllUsers };
