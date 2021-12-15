const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser
} = require("../controllers/usersControllers");

const {isAuthenticated, authorizeRole} = require("../midleware/auth")

router.route("/users").post(registerUser);
router.route("/login").post(loginUser);

router.route("/password/reset").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated,getUserProfile);
router.route("/password/update").put(isAuthenticated,updatePassword);
router.route("/me/update").put(isAuthenticated,updateProfile);


router.route("/admin/users").get(isAuthenticated,authorizeRole('admin'),allUsers);
router.route("/admin/users/:id")
.get(isAuthenticated,authorizeRole('admin'),getUserDetails)
.put(isAuthenticated,authorizeRole('admin'),updateUser)
.delete(isAuthenticated,authorizeRole('admin'),deleteUser)

module.exports = router;
