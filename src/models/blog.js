const mongoose = require("mongoose");
const postSchema = {
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
};

const Post = new mongoose.model("Post", postSchema);
module.exports = Post;
