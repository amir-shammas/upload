const express = require("express");
const postController = require("./../controllers/post.controller");
const isAuthenticated = require("./../middlewares/isAuthenticated.middleware");
const isNotBan = require("./../middlewares/isNotBan.middleware");
const isEmailVerified = require("./../middlewares/isEmailVerified.middleware");
const isMyPost = require("./../middlewares/isMyPost.middleware");

const router = express.Router();


router.route("/create-new-post")
 .post(isAuthenticated, isNotBan, isEmailVerified, postController.createNewPost);


router.route("/get-all-posts")
 .get(postController.getAllPosts);


router.route("/get-one-post/:id")
 .get(postController.getOnePost);


router.route("/get-my-posts")
 .get(isAuthenticated, isNotBan, isEmailVerified, postController.getMyPosts);


router.route("/get-my-post/:id")
 .get(isAuthenticated, isNotBan, isEmailVerified, isMyPost, postController.getMyPost);


router.route("/update-my-post/:id")
 .patch(isAuthenticated, isNotBan, isEmailVerified, isMyPost, postController.updateMyPost);


router.route("/delete-my-post/:id")
 .delete(isAuthenticated, isNotBan, isEmailVerified, isMyPost, postController.deleteMyPost);


module.exports = router;
