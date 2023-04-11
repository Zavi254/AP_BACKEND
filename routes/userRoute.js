const express = require("express");
const { registerUser } = require("../controllers/userController");
const { verifyToken } = require("../controllers/verifyTokenController");
const router = express.Router();

router.post("/register", registerUser);
router.get("/user/verify/:id/:token", verifyToken);

module.exports = router;
