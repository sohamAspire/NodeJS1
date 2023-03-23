require("dotenv").config();
const session = require("express-session");
const express = require("express");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const staticPath = path.join(__dirname, "./Partials");
const stylePath = path.join(__dirname, "./css");
const bcrypt = require("bcryptjs");
const Detail = require("./Schema");
require("./conn");
app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(stylePath));
hbs.registerPartials(staticPath);

app.use(cookieParser());

app.get("/", auth, (req, res) => {
  // console.log(req.cookies.Login);
  res.render("Index");
});

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.post("/Register", async (req, res) => {
  try {
    const Data = new Detail({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    });

    const token = await Data.generateToken();
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

app.get("/logout", auth, async (req, res) => {
  try {
    res.clearCookie("Login");

    req.user.tokens = req.user.tokens.filter((elem) => {
      return elem.token !== req.token;
    });

    await req.user.save();
    res.render("Login");
  } catch (error) {
    res.status(400).send(error);
  }
  // res.send("Register");
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userEmail = await Detail.find({ email: email });
    const isMatch = await bcrypt.compare(password, userEmail[0].password);
    const token = await userEmail[0].generateToken();
    // console.log(token);

    // console.log(isMatch);
    if (isMatch) {
      res.status(200).render("Index", {
        msg: "Success",
      });
      res.cookie("Login", token, {
        expires: new Date(Date.now() + 50000),
        httpOnly: true,
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


// index.js

/*  PASSPORT SETUP  */

const passport = require("passport");
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get("/success", (req, res) => res.send(userProfile));
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect("/success");
  }
);
