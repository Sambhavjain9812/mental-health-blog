const exp = require("constants");
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const homeStartingContent =
  "Welcome to the Blogging Section where you can share your thought processes and journeys with the wider audience of the Campus. It is a place for everyone to feel safe and secure  Through this blogging site, you can read others blog as well as write your own journey to guide others on their path ";

require("./db/conn");
const Register = require("./models/registers");
const Post = require("./models/blog");
const { error } = require("console");

const app = express();
const staticpath = path.join(__dirname, "../public");


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");


app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("landing");
});
app.get("/landing", (req, res) => {
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
app.get("/score", (req, res) => {
  res.render("score");
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
app.post("/score1", function (req, res) {
  res.redirect("/score")
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user_username = await Register.findOne({ username: username });
    
    const isMatch = await bcrypt.compare(password, user_username.password);
    const token = await user_username.generateAuthToken();

    console.log("token part is " + token);
    if (isMatch) {
      res.status(201).render("landing");
    } else {
      res.send("Invalid password");
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});
app.get("/post", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});
app.get("/analysis", function (req, res) {
  res.render("analysis");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/post");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

// app.get("/about", function(req, res){
//   res.render("about", {aboutContent: aboutContent});
// });

// app.get("/contact", function(req, res){
//   res.render("contact", {contactContent: contactContent});
// });
app.listen(3000, () => {
  console.log("server is running at 3000");
});
