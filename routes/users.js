const express = require("express");
const router = express.Router();

const registerController = require("../controllers/registerController");


router.post("/register", registerController);

router.post("/login", (req, res) => {
    res.render("login");
});

module.exports = router;