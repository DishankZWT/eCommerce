const { where } = require("sequelize");
const { wishlist } = require("../db/dbmodel");

// function to add product to user`s wishlist
async function addToWishList(req, res) {
  try {
    //role validation

    if (req.user.role != "customer") {
      return res.status(402).json({ message: `invalid role` });
    }
    // id availability check
    if (!req.body.productId) {
      return res.status(400).json({ message: `productId required` });
    }
    const userWishList = {
      user_id: req.user.id,
      product_id: req.body.productId,
    };
    const duplicate = await wishlist.findOne({
      where: {
        user_id: req.user.id,
        product_id: req.body.productId,
      },
    });
    if (!duplicate) {
      const productAdd = await wishlist.create(userWishList);
    }
    return res
      .status(200)
      .json({ message: `product successfully added to wishlist` });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

// function to get all wishlist items from wishlist table
async function getWishList(req, res) {
  try {
    if (req.user.role != "customer") {
      return res.status(402).json({ message: `invalid role` });
    }
    const userWishList = await wishlist.findAll({
      where: { user_id: req.user.id },
    });
    return res.status(200).json(userWishList);
  } catch (error) {
    return res.status(400).json({ error });
  }
}

// function to remove item from wishlist
async function removeFromWishList(req, res) {
  try {
    if (req.user.role != "customer") {
      return res.status(402).json({ message: `invalid role` });
    }
    const targetId = req.params.id;
    const deleteItemFromWishList = await wishlist.destroy({
      where: { product_id: targetId },
    });
    return res.status(200).json({ message: `item deleted from wishlist` });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

module.exports = {
  addToWishList,
  getWishList,
  removeFromWishList,
};
