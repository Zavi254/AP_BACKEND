const express = require("express");
const colors = require("colors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use("/", require("./routes/userRoute"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
