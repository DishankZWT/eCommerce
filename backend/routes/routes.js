const express = require("express");
const { upload } = require("../utilities/multer");

//Router
const router = express.Router();

//controllers
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");
const cartController = require("../controllers/cartController");
const wishlistController = require("../controllers/wishlistController");
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

//middlewares
const authenticate = require("../middleware/tokenCheck");

// authorization routes
router.post("/api/auth/register", authController.signup); //ok
router.post("/api/auth/login", authController.login); //ok

// userController rotes
router.get("/", userController.home); //ok
router.get("/api/users/profile", authenticate, userController.getUserProfile); //ok
router.get("/api/users", authenticate, userController.getAllUsers); //ok
router.put(
  "/api/users/profile",
  authenticate,
  userController.updateUserProfile
); //ok

// productController routes
router.get("/api/products", productController.getProducts); // (filter baki)
router.get("/api/products/:id", productController.getProductById); //baki
router.post(
  "/api/products",
  authenticate,
  upload.single("image"),
  productController.addNewProduct //baki
);

router.patch(
  "/api/products/:id",
  authenticate,
  upload.single("image"),
  productController.updateProduct //baki
);

router.delete(
  "/api/products/:id",
  authenticate,
  productController.deleteProduct //baki
);

// categoryController routes
router.get("/api/categories", categoryController.getCategories); //ok
router.post("/api/categories", authenticate, categoryController.createCategory); //ok

// cartController routes
router.get("/api/cart", authenticate, cartController.getCartItems); //baki
router.post("/api/cart", authenticate, cartController.addToCart); //baki
router.delete("/api/cart/:id", authenticate, cartController.removeFromCart); //baki

// wishlistController routes
router.get("/api/wishlist", authenticate, wishlistController.getWishList); //baki
router.post("/api/wishlist", authenticate, wishlistController.addToWishList); //baki
router.delete(
  "/api/wishlist/:id",
  authenticate,
  wishlistController.removeFromWishList
); //baki

// orderController routes (not complete)
router.get("/api/orders", authenticate, orderController.getOrderHistory);
router.get("/api/orders/:id", authenticate, orderController.getOrderDetails);
router.post("/api/orders", authenticate, orderController.placeOrder);
router.put(
  "/api/orders/:id/status",
  authenticate,
  orderController.updateOrderStatus
);

module.exports = router;
