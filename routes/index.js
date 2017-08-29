const express = require("express");
const router = express.Router();

const mainPageController = require("../controllers/mainPageController");

router.get("/", mainPageController);

module.exports = router;