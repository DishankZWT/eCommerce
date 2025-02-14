const { products } = require("../db/dbmodel");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { productCredentials } = require("../utilities/validator");

// function to get list of all products from products table
async function getProducts(req, res) {
  try {
    const filter = {
      ...(req.query.priceGt && {
        price: { [Op.gt]: Number(req.query.priceGt) },
      }),
      ...(req.query.priceLt && {
        price: { [Op.lt]: Number(req.query.priceLt) },
      }),
      ...(req.query.stockGt && {
        stock: { [Op.gt]: Number(req.query.stockGt) },
      }),
      ...(req.query.cId && { category_id: req.query.cId }),
    };

    const filteredProducts = await products.findAll({ where: filter });
    return res.status(200).json(filteredProducts);
  } catch (error) {
    return res.status(400).json({ error });
  }
}

// function to get product by id from products table
async function getProductById(req, res) {
  try {
    const inputId = req.params.id;
    const product = await products.findByPk(inputId);
    if (product == null) {
      return res.status(401).json({ message: `no such product available` });
    }
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

// function to add new product into the products table by admin
async function addNewProduct(req, res) {
  try {
    if (req.user.role != "admin") {
      return res.status(402).json({ message: `invalid role` });
    }
    console.log(req.body);

    const validFormat = await productCredentials(req.body);
    const duplicate = await products.findOne({
      where: { name: req.body.name },
    });
    if (!duplicate) {
      const fileName = req.file.originalname;
      const filePath = path.join(__dirname, "../media", fileName);
      fs.writeFile(filePath, req.file.buffer, (err) => {
        if (err) {
          return res.status(500).send("Error saving file");
        }
      });
      const { name, price, category_id, description, stock } = req.body;
      const productTemplate = {
        stock: 0,
        ...{ name, price, category_id, description, stock },
        image_url: fileName,
      };
      const newProduct = await products.create(productTemplate);
      return res
        .status(200)
        .json({ message: `product ${req.body.name} is added` });
    } else {
      return res.status(400).json({ message: `product with same name exist` });
    }
  } catch (error) {
    return res.status(400).json(error.errors);
  }
}

// function to update product details into products table by admin
async function updateProduct(req, res) {
  try {
    if (req.user.role != "admin") {
      return res.status(402).json({ message: `invalid role` });
    }
    const inputId = req.params.id;
    const previousImage = await products.findByPk(inputId);
    if (previousImage.dataValues.image_url != null) {
      fs.rm(`${previousImage.dataValues.image_url}`, () => {});
    }
    const { name, description, price, stock, category_id } = req?.body;

    const obj = {
      ...(name && { name: name }),
      ...(description && { description: description }),
      ...(price && { price: price }),
      ...(stock && { stock: stock }),
      ...(category_id && { category_id: category_id }),
    };
    if (req.file) {
      const filePath = path.join(__dirname, "../media", req.file.originalname);
      fs.writeFile(filePath, req.file.buffer, (err) => {
        if (err) {
          return res.status(500).send("Error saving file");
        }
      });
      obj.image_url = filePath;
    }
    const updatedProduct = await products.update(obj, {
      where: { id: inputId },
    });
    return res.status(200).json({ message: `product is updated successfully` });
  } catch (error) {
    console.log(error);

    return res.status(400).json({ error });
  }
}

// function to delete product from products table by admin
async function deleteProduct(req, res) {
  try {
    if (req.user.role != "admin") {
      return res.status(402).json({ message: `invalid role` });
    }
    const targetId = req.params.id;
    const previousImage = await products.findByPk(targetId);
    console.log({ previousImage });

    fs.rm(`./backend/media/${previousImage.dataValues.image_url}`, () => {});
    const deletedProduct = await products.destroy({ where: { id: targetId } });
    return res.status(200).json({ message: `product deleted successfully` });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

module.exports = {
  getProducts,
  getProductById,
  addNewProduct,
  updateProduct,
  deleteProduct,
};
