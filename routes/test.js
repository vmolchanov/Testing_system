const express = require("express");
const router = express.Router();
const path = require("path");

const testController = require("../controllers/testController");

router.use(express.static(path.join(__dirname, "../public")));

router.get("/:testId", testController);

module.exports = router;