const { cart, products } = require("../db/dbmodel");

// function to add products to the customer`s cart in carts table
async function addToCart(req, res) {
  try {
    //role validation
    if (req.user.role != "customer") {
      return res.status(402).json({ message: `invalid role` });
    }

    //id availability check
    if (!req.body.product_id) {
      return res.status(401).json({ message: `product_id required` });
    }

    //check for duplicate
    const duplicate = await cart.findOne({
      where: { user_id: req.user.id, product_id: req.body.product_id },
    });
    //if duplicate
    if (duplicate) {
      const userCart = {
        quantity: req.body.quantity
          ? duplicate.quantity + req.body.quantity
          : duplicate.quantity + 1,
      };
      const productAdd = await cart.update(userCart, {
        where: { user_id: req.user.id },
      });
      //if not duplicate
    } else {
      const userCart = {
        user_id: req.user.id,
        product_id: req.body.product_id,
        ...(req.body.quantity
          ? { quantity: req.body.quantity }
          : { quantity: 1 }),
      };
      const validProduct = await products.findOne({
        where: { id: userCart.product_id },
      });
      const productAdd = await cart.create(userCart);
    }
    return res
      .status(200)
      .json({ message: `product successfully added to the cart` });
  } catch (error) {
    return res.status(401).json({ message: `no such product exist` });
  }
}

// function to get all the cart items from cart table
async function getCartItems(req, res) {
  try {
    if (req.user.role != "customer") {
      return res.status(402).json({ message: `invalid role` });
    }
    const userCart = await cart.findAll({ where: { user_id: req.user.id } });
    return res.status(200).json(userCart);
  } catch (error) {
    return res.status(400).json({ error });
  }
}

// function to remove item from the cart
async function removeFromCart(req, res) {
  try {
    if (req.user.role != "customer") {
      return res.status(402).json({ message: `invalid role` });
    }
    const targetId = req.params.id;
    const deleteItemFromCart = await cart.destroy({
      where: { product_id: targetId },
    });
    return res.status(200).json({ message: `item deleted from the cart` });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
};
