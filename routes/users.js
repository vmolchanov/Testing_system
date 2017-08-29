const express = require("express");
const router = express.Router();

const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");


router.post("/register", registerController);

router.post("/login", loginController);

module.exports = router;