const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  image: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  }
})
const Post = mongoose.model("Post", postSchema);
module.exports = {postSchema, Post}
