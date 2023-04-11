const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Token = require("../models/token");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // user exist
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "User Email already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    let token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const message = `https://ap-backend-0p5c.onrender.com/user/verify/${user.id}/${token.token}`;

    if (user) {
      await sendEmail(user.email, "Verify Email", message);
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { registerUser };
