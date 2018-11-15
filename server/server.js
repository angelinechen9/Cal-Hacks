const express = require("express");
const hbs = require("hbs");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const _ = require("lodash");
require("dotenv").config();
const postsRoute = require("./routes/postsRoute.js");
const {Post} = require("./models/post.js");
const app = express();
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
hbs.registerPartials(path.join(__dirname, "../views", "partials"));
mongoose.connect("mongodb://localhost:27017/StressManagementJournal");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
const {Storage} = require("@google-cloud/storage");
const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();
const storage = new Storage();
storage
  .getBuckets()
  .then((results) => {
    const buckets = results[0];
    console.log('Buckets:');
    buckets.forEach((bucket) => {
      console.log(bucket.name);
    });
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
Post.find()
.then(posts => {
  let fileNames = [];
  posts.forEach(post => {
    let fileName = "./public/images/" + post.image;
    fileNames.push(fileName);
  })
  fileNames.forEach(fileName => {
    client
    .faceDetection(fileName)
    .then(results => {
      const faces = results[0].faceAnnotations;
      console.log('Faces:');
      faces.forEach((face, i) => {
        console.log(`  Face #${i + 1}:`);
        console.log(`    Joy: ${face.joyLikelihood}`);
        console.log(`    Anger: ${face.angerLikelihood}`);
        console.log(`    Sorrow: ${face.sorrowLikelihood}`);
        console.log(`    Surprise: ${face.surpriseLikelihood}`);
        if (((face.joyLikelihood === "LIKELY") || (face.joyLikelihood === "VERY_LIKELY")) && ((face.surpriseLikelihood === "LIKELY") || (face.surpriseLikelihood === "VERY_LIKELY"))) {
          console.log("😀");
        }
        if (((face.angerLikelihood === "LIKELY") || (face.angerLikelihood === "VERY_LIKELY")) && ((face.sorrowLikelihood === "LIKELY") || (face.sorrowLikelihood === "VERY_LIKELY"))) {
          console.log("😢");
        }
      })
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  })
})
.catch(e => {
  res.status(404).send(e);
})
app.get("/", (req, res) => {
  res.redirect("/posts");
})
app.use("/posts", postsRoute);
app.listen(3000);
