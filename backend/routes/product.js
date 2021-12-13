const express = require("express");
const router = express.Router();


const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");


router.route("/product").get(getProducts);
router.route("/admin/products/:id").get(getSingleProduct);
router.route("/admin/products/:id").put(updateProduct);
router.route("/admin/products/:id").delete(deleteProduct);


router.route("/product/new").post(newProduct);

module.exports = router;
