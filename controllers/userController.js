const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

function sendEmail(email, firstName, lastName) {
  return new Promise((resolve, reject) => {
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
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: `Email sent successfully` });
    });
  });
}

const registerUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // user exist
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User Email already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create
  const user = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  if (user) {
    sendEmail(email, first_name, last_name);
    res.status(201).json({
      _id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

module.exports = { registerUser };
