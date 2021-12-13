const express = require("express");
const router = express.Router();


const { registerUser } = require('../controllers/usersControllers')




router.route("/users").get(registerUser);

module.exports = router;
