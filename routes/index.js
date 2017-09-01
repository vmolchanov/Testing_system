const express = require("express");
const router = express.Router();

const mainPageController = require("../controllers/mainPageController");
const restorationController = require("../controllers/restorationController");

router.get("/", mainPageController);

router.get("/restoration", restorationController);

router.put("/restoration", restorationController);

module.exports = router;