const express = require("express");
const _ = require("lodash");
const multer = require("multer");
const upload = multer({dest: "./public/images"});
const postsRoute = express.Router();
const {Post} = require("../models/post.js");
postsRoute.get("/", (req, res) => {
  Post.find()
  .then(posts => {
    res.render("index.hbs", {
      posts
    });
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
postsRoute.get("/new", (req, res) => {
  res.render("new.hbs");
})
postsRoute.post("/", upload.single("image"), (req, res) => {
  const post = new Post({
    image: req.file.filename,
    title: req.body.title,
    post: req.body.post
  })
  post.save()
  .then(post => {
    res.redirect("/");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
postsRoute.get("/:id", (req, res) => {
  Post.find({_id: req.params.id})
  .then(post => {
    res.render("show.hbs", {
      id: post[0]._id,
      image: post[0].image,
      title: post[0].title,
      post: post[0].post
    });
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
postsRoute.get("/:id/edit", (req, res) => {
  Post.find({_id: req.params.id})
  .then(post => {
    res.render("edit.hbs", {
      id: post[0]._id,
      image: post[0].image,
      title: post[0].title,
      post: post[0].post
    });
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
postsRoute.put("/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  const image = req.file.filename;
  const body = _.pick(req.body, ["title", "post"]);
  Post.findByIdAndUpdate(id, {$set: {image, body}}, {new: true})
  .then(post => {
    res.redirect("/");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
postsRoute.delete("/:id", (req, res) => {
  const id = req.params.id;
  Post.findByIdAndRemove(id)
  .then(post => {
    res.redirect("/");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
module.exports = postsRoute
