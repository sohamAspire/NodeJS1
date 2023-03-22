const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const staticPath = path.join(__dirname, "./Partials");
const stylePath = path.join(__dirname, "./css");
const bcrypt = require("bcryptjs");
const Detail = require("./Schema");
require("../Practical1/conn");
app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(stylePath));
hbs.registerPartials(staticPath);

app.get("/", (req, res) => {
  res.render("Index");
});

app.post("/Register", async (req, res) => {
  try {
    const Data = new Detail({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    });
    const response = await Data.save();
    res.status(200).render("Register");
  } catch (error) {
    console.log(error);
    res.status(400).render("Register");
  }
});

app.get("/register", (req, res) => {
  res.render("Register");
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const Login = await Detail.find({ email: email });
    const isMatch = await bcrypt.compare(password, Login[0].password);
    console.log(isMatch);
    if (isMatch) {
      res.status(200).render("Index", {
        msg: "Success",
      });
    } else {
      res.status(400).render("Login");
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("Port is Listening at 3000");
});
