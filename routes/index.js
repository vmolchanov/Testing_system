const express = require("express");
const router = express.Router();

const mainPageController = require("../controllers/mainPageController");
const restorationController = require("../controllers/restorationController");
const successController = require("../controllers/successController");

router.get("/", mainPageController);

router.get("/restoration", restorationController);

router.put("/restoration", restorationController);

router.get("/success", successController);

module.exports = router;