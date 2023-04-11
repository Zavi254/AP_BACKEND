const User = require("../models/userModel");
const Token = require("../models/token");

const verifyToken = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send("invalid link");

    await User.updateOne({ _id: user.id, isVerified: true });

    await Token.findByIdAndRemove(token._id);

    res.send("Email verified successfully");
  } catch (error) {
    res.status(400).send("An error occured");
  }
};

module.exports = { verifyToken };
