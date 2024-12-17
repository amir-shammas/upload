const mongoose = require("mongoose");
const { registerValidator, loginValidator , forgetPasswordValidator , resetPasswordValidator } = require("./../validators/auth.validator");
const { updateValidator , changePasswordValidator_ByUser , getOtherUserProfileValidator } = require("./../validators/user.validator");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    isBan: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatarName: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    resumeName: {
      type: String,
      default: null,
    },
    resumeUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      }
    ],   // Reference to Post
  },
  { timestamps: true }
);

//* add yup validation method to mongoose statics
//* register
userSchema.statics.registerValidation = function (body) {
  return registerValidator.validate(body, { abortEarly: false });
};
//* login
userSchema.statics.loginValidation = function (body) {
  return loginValidator.validate(body, { abortEarly: false });
};
//* forget password
userSchema.statics.forgetPasswordValidation = function (body) {
  return forgetPasswordValidator.validate(body, { abortEarly: false });
};
//* reset password
userSchema.statics.resetPasswordValidation = function (body) {
  return resetPasswordValidator.validate(body, { abortEarly: false });
};
//* update
userSchema.statics.updateValidation = function (body) {
  return updateValidator.validate(body, { abortEarly: false });
};
//* change password By User
userSchema.statics.changePasswordValidation_ByUser = function (body) {
  return changePasswordValidator_ByUser.validate(body, { abortEarly: false });
};
//* get other user profile
userSchema.statics.getOtherUserProfileValidation = function (body) {
  return getOtherUserProfileValidator.validate(body, { abortEarly: false });
};


module.exports = mongoose.model("User", userSchema);
