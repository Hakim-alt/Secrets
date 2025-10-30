//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
 
console.log(process.env.API_KEY);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//encrytion
userSchema.plugin(
  encrypt,
  { secret: process.env.SECRET ,
   encryptedFields: ["password"] }
);

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    await newUser.save();
    res.render("secrets");
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const userFind = await User.findOne({ email: username });
    if (userFind) {
      if (userFind.password === password) {
        res.render("secrets");
      } else {
        res.send("Password incorrect");
      }
    } else {
      res.send("No user found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(3006, function () {
  console.log("Server started on port 3006");
});
