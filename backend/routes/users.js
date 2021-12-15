const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
} = require("../controllers/usersControllers");

const {isAuthenticated} = require("../midleware/auth")

router.route("/users").post(registerUser);
router.route("/login").post(loginUser);

router.route("/password/reset").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated,getUserProfile);

module.exports = router;
