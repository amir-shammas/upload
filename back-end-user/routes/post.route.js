const express = require("express");
const postController = require("./../controllers/post.controller");
const isAuthenticated = require("./../middlewares/isAuthenticated.middleware");
const isNotBan = require("./../middlewares/isNotBan.middleware");
const isEmailVerified = require("./../middlewares/isEmailVerified.middleware");

const router = express.Router();


router.route("/create")
 .post(isAuthenticated, isNotBan, isEmailVerified, postController.createPost);


router.route("/get-all")
 .get(postController.getAllPosts);


module.exports = router;
