const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

function sendEmail(email, firstName, lastName) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mail_configs = {
    from: process.env.EMAIL,
    to: email,
    subject: `Welcome to Africa's Pocket ${firstName} ${lastName}`,
    html: `
        <h1>Hi there ${firstName} ${lastName}</h1>
        <p>Welcome to Africa's Pocket</p>
        <a href="http:localhost:3000/verify">Click to verify</a>
      `,
  };

  transporter.sendMail(mail_configs, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent succesfully`.cyan.underline);
    }
  });
}

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // user exist
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User Email already exists" });
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

    // Create a token
    // const token = jwt.sign(
    //   {
    //     user_id: user._id,
    //     email,
    //   },
    //   process.env.TOKEN_KEY,
    //   { expiresIn: "2h" }
    // );

    // user.token = token;

    if (user) {
      sendEmail(email, first_name, last_name);
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
