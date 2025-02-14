const { orders, order_items, cart, products } = require("../db/dbmodel.js");
const yup = require("yup");

// PLACE ORDER FUNCTION
async function placeOrder(req, res) {
  try {
    const user_id = req.user.id;
    const cart_items = await cart.findAll({ where: { user_id: user_id } });
    if (cart_items.length == 0) {
      return res.status(400).json({ message: "No items found in cart" });
    }

    let total_price = 0;
    let order_items_data = [];
    let order_list = [];

    for (let cart_data of cart_items) {
      const product_id = parseInt(cart_data.product_id);
      const product_data = await products.findByPk(product_id);

      if (!product_data) {
        return res
          .status(404)
          .json({ message: `Product with ID: ${product_id} not found` });
      }

      const product_quantity = parseInt(cart_data.quantity);
      const product_price = parseFloat(product_data.price);
      const item_total_price = product_quantity * product_price;

      if (product_quantity > product_data.stock) {
        return res.status(409).json({
          message: `Not enough stock available for the selected item: ${product_data.name}`,
        });
      }

      total_price += item_total_price;

      order_items_data.push({
        product_id,
        quantity: product_quantity,
        price: product_price,
      });

      order_list.push({
        product_name: product_data.name,
        product_description: product_data.description,
        product_image: product_data.image_url,
        quantity: product_quantity,
        price: product_price,
      });
    }

    const order = await orders.create({
      user_id: user_id,
      total_price: total_price,
      status: "pending",
    });

    await order_items.bulkCreate(
      order_items_data.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }))
    );

    for (const item of order_items_data) {
      await products.decrement(
        { stock: item.quantity },
        { where: { id: item.product_id } }
      );
    }

    await cart.destroy({
      where: { user_id: user_id },
    });

    return res.status(200).json({
      message: "Order placed successfully",
      order_id: order.id,
      total_price,
      order_list,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET ORDER HISTORY FUNCTION
async function getOrderHistory(req, res) {
  try {
    const user_id = parseInt(req.user.id);
    const userOrders = await orders.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: order_items,
          include: [
            {
              model: products,
            },
          ],
        },
      ],
    });
    if (userOrders) {
      return res
        .status(200)
        .json({ message: "Order details", data: userOrders });
    } else {
      return res.status(404).json({ error: "No order has been placed yet" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// GET ORDER DETAILS BY ID FUNCTION
async function getOrderDetails(req, res) {
  try {
    const user_id = parseInt(req.user.id);
    const id = parseInt(req.params.id);
    const userOrder = await orders.findByPk(id, {
      where: { user_id: user_id },
      include: [
        {
          model: order_items,
        },
      ],
    });
    if (userOrder) {
      return res
        .status(200)
        .json({ message: "Order details", data: userOrder });
    } else {
      return res.status(404).json({ error: "No order has been placed yet" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// UPDATE ORDER STATUS FUNCTION
async function updateOrderStatus(req, res) {
  try {
    const status = req.body.status;
    try {
      const updateStatus = yup.object({
        status: yup
          .string()
          .optional()
          .oneOf(
            ["pending", "shipped", "delievered", "canceled"],
            "Not a valid status, enter a valid status"
          )
          .transform((value) => value && value.toLowerCase()),
      });

      await updateStatus.validate({
        status,
      });
    } catch (validationError) {
      return res.status(406).json({ error: validationError.message });
    }
    const id = parseInt(req.params.id);
    if (status) {
      await orders.update(
        {
          status: status,
        },
        { where: { id: id } }
      );

      const order = await orders.findByPk(id);
      return res
        .status(200)
        .json({ message: "Order status updated", data: order });
    } else {
      res
        .status(400)
        .json({ error: "Please provide a appropriate status to update" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getOrderHistory,
  getOrderDetails,
  placeOrder,
  updateOrderStatus,
};
