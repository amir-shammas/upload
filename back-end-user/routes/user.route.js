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


router.route("/upload-avatar")
 .patch(isAuthenticated, isNotBan, isEmailVerified, userController.uploadAvatar);


router.route("/download-avatar")
 .get(isAuthenticated, isNotBan, isEmailVerified, userController.downloadAvatar);


router.route("/delete-avatar")
 .delete(isAuthenticated, isNotBan, isEmailVerified, userController.deleteAvatar);


router.route("/upload-resume")
 .patch(isAuthenticated, isNotBan, isEmailVerified, userController.uploadResume);


router.route("/download-resume")
 .get(isAuthenticated, isNotBan, isEmailVerified, userController.downloadResume);


router.route("/delete-resume")
 .delete(isAuthenticated, isNotBan, isEmailVerified, userController.deleteResume);


router.route("/update-bio")
 .patch(isAuthenticated, isNotBan, isEmailVerified, userController.updateBio);


module.exports = router;
