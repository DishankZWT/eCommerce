const { categories } = require("../db/dbmodel");

// function to get list of all categories from categories table
async function getCategories(req, res) {
  try {
    const allCategories = await categories.findAll();
    return res.status(200).json(allCategories);
  } catch (error) {
    return res.status(400).json({ error });
  }
}

// function to create new category by admin
async function createCategory(req, res) {
  try {
    if (req.user.role != "admin") {
      return res.status(402).json({ message: `invalid role` });
    }
    if (!req.body.name) {
      return res.status(400).json({ message: `category name is required` });
    }
    console.log(req.body.name);

    const newCategory = await categories.create({ name: req.body.name });
    return res
      .status(200)
      .json({ message: `category ${req.body.name} is created` });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

module.exports = {
  getCategories,
  createCategory,
};
