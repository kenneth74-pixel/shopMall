const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
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

module.exports = router;
