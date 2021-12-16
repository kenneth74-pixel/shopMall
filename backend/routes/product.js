const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,

  createProductReview,
  deleteReview,
  getProductReviews,
} = require("../controllers/productController");

const { isAuthenticated, authorizeRole } = require("../midleware/auth");

router.route("/product").get(getProducts);
router.route("/products/:id").get(getSingleProduct);

router
  .route("/product/new")
  .post(isAuthenticated, authorizeRole("admin"), newProduct);
router
  .route("/admin/products/:id")
  .put(isAuthenticated, authorizeRole("admin"), updateProduct);
router
  .route("/admin/products/:id")
  .delete(isAuthenticated, authorizeRole("admin"), deleteProduct);

router.route("/review").put(isAuthenticated, createProductReview);
router.route("/reviews").get(isAuthenticated, getProductReviews);
router.route("/reviews").delete(isAuthenticated, deleteReview);

module.exports = router;
