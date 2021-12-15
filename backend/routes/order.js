const express = require("express");
const router = express.Router();

const {
  newOrder,
  myOrder,
  getSingleOrder,
  allOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const { isAuthenticated, authorizeRole } = require("../midleware/auth");

router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/order/:id").get(isAuthenticated, getSingleOrder);
router.route("/order/me").get(isAuthenticated, myOrder);

router
  .route("/admin/order")
  .get(isAuthenticated, authorizeRole("admin"), allOrder);
router
  .route("/admin/order/:id")
  .put(isAuthenticated, authorizeRole("admin"), updateOrder)
  .delete(isAuthenticated, authorizeRole("admin"), deleteOrder);

module.exports = router;
