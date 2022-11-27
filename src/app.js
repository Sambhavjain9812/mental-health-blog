const exp = require("constants");
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

require("./db/conn");
const Register = require("./models/registers");
const Post = require("./models/blog");
const { error } = require("console");

const app = express();
const staticpath = path.join(__dirname, "../public");
// const templateview = path.join(__dirname, "../templates/views");
// const templatepartials = path.join(__dirname, "../templates/partials");
// app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
// app.set("views", templateview);
// ejs.registerPartials(templatepartials);

// app.use(
//   "/css",
//   express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css"))
// );
// app.use(
//   "/js",
//   express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js"))
// );
// app.use("/jq", express.static(path.join(__dirname, "../node_modules/jquery")));

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
app.get("/post", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
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
