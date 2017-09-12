const express = require("express");
const router = express.Router();

router.use(express.static(path.join(__dirname, "../public")));

// TODO реализовать роут для завершения теста
router.post("/:testId/finish", (req, res) => {});

// TODO реализовать роут для получения теста
router.get("/:testId", (req, res) => {});

// TODO реализовать роут для получения следующего вопроса
router.post("/:testId", (req, res) => {});