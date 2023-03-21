const express = require("express");
const { registerUser } = require("../controllers/userController");
const router = express.Router();

router.post("/api/users", registerUser);

module.exports = router;
