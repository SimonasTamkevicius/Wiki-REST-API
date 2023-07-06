const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////////////// Requests targeting all articles //////////////////////////////////////////

app.route("/articles")
    .get(function (req, res) {
        Article.find({}).exec()
        .then(function (articles) {
            res.send(articles);
        })
        .catch (function(err) {
            res.send(err);
        })
    })
    .post(function(req, res) {
        const newArticle = new Article ({
            title: req.body.title,
            content: req.body.content
        })
    
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res){
        Article.deleteMany({}).exec()
          .then(function (){
            res.send("Successfully deleted articles.")
          })
          .catch (function (err) {
            res.send(err);
          })
    });

//////////////////////////////////////////// Requests targeting a specific article //////////////////////////////////////////

app.route("/articles/:articleTitle")
    .get(function(req, res) {
        // console.log(req.params.articleTitle);

        Article.findOne({title: req.params.articleTitle}).exec()
          .then(function(foundArticle) {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No article matching that title were found.")
            }
          })
          .catch(function (err){
            console.log(err);
          })
    })
    .put(function(req, res) {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true}
        ).exec()
          .then(function() {
            res.send("Successfully updated article.")
          })
          .catch(function (err) {
            res.send(err);
          })
    })
    .patch(function(req, res) {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {$set: req.body}
        ).exec()
          .then(function(){
            res.send("Successfully updated article.")
          })
          .catch(function(err) {
            res.send(err);
          })
    })
    .delete(function(req, res) {
        Article.deleteOne({title: req.params.articleTitle}).exec()
          .then(function() {
            res.send("Successfully deleted article.")
          })
          .catch(function(err) {
            res.send(err);
          })
    })

app.listen(3000, function() {
  console.log("Server started on port 3000");
});