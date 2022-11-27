const exp = require("constants");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("./db/conn");
const Register = require("./models/registers");
const { error } = require("console");

const app = express();
const staticpath = path.join(__dirname, "../public");
const templateview = path.join(__dirname, "../templates/views");
const templatepartials = path.join(__dirname, "../templates/partials");
// app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", templateview);
hbs.registerPartials(templatepartials);

app.use(
  "/css",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js"))
);
app.use("/jq", express.static(path.join(__dirname, "../node_modules/jquery")));

app.use(express.static(staticpath));

app.get("/", (req, res) => {
  res.render("landing");
});
app.get("/remedies", (req, res) => {
  res.render("remedies");
});
app.get("/faq", (req, res) => {
  res.render("faq");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const registerUser = new Register({
        phonenumber: req.body.phonenumber,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });
      console.log("the success part" + registerUser);
      const token = await registerUser.generateAuthToken();

      console.log("token part is " + token);
      const registered = await registerUser.save();

      console.log("page part is " + registered);
      res.status(201).render("landing");
    } else {
      res.send("password not same");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user_username = await Register.findOne({ username: username });
    // res.send(useremail);
    // console.log(useremail);
    const isMatch = await bcrypt.compare(password, user_username.password);
    const token = await user_username.generateAuthToken();

    console.log("token part is " + token);
    if (isMatch) {
      res.status(201).render("landing");
    } else {
      res.send("invalid password");
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("server is running at 3000");
});
