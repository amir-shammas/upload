const express = require("express");

const userController = require("./../controllers/user.controller");
const isAuthenticated = require("./../middlewares/isAuthenticated.middleware");
const isAdmin = require("./../middlewares/isAdmin.middleware");
const isNotBan = require("./../middlewares/isNotBan.middleware");
const isEmailVerified = require("./../middlewares/isEmailVerified.middleware");


const router = express.Router();


router.route("/update-user")
 .patch(isAuthenticated, isNotBan, isEmailVerified, userController.updateUser);


router.route("/change-password")
 .patch(isAuthenticated, isNotBan, isEmailVerified, userController.changeUserPassword);


router.route("/send-link-for-verify-email")
 .post(isAuthenticated, isNotBan, userController.sendLinkForVerifyEmail);


router.route("/verify-email/:token")
 .post(isAuthenticated, isNotBan, userController.verifyEmail);


router.route("/update-avatar")
 .patch(isAuthenticated, isNotBan, isEmailVerified, userController.updateAvatar);


router.route("/upload-resume")
 .patch(isAuthenticated, isNotBan, isEmailVerified, userController.uploadResume);


router.route("/download-resume")
 .get(isAuthenticated, isNotBan, isEmailVerified, userController.downloadResume);


module.exports = router;
