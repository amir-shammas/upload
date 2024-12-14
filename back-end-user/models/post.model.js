const mongoose = require("mongoose");
const { createNewPostValidator , getOnePostValidator , getMyPostValidator , updateMyPostValidator , deleteMyPostValidator , getOtherUserPostsValidator } = require("./../validators/post.validator");


const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User
      required: true,
    },
    isVerified: {
      type: Boolean,
      // default: false,
      default: true,
    },
  },
  { timestamps: true }
);


postSchema.statics.createNewPostValidation = function (body) {
  return createNewPostValidator.validate(body, { abortEarly: false });
};


postSchema.statics.getOnePostValidation = function (body) {
  return getOnePostValidator.validate(body, { abortEarly: false });
};


postSchema.statics.getOtherUserPostsValidation = function (body) {
  return getOtherUserPostsValidator.validate(body, { abortEarly: false });
};


postSchema.statics.getMyPostValidation = function (body) {
  return getMyPostValidator.validate(body, { abortEarly: false });
};


postSchema.statics.updateMyPostValidation = function (body) {
  return updateMyPostValidator.validate(body, { abortEarly: false });
};


postSchema.statics.deleteMyPostValidation = function (body) {
  return deleteMyPostValidator.validate(body, { abortEarly: false });
};


module.exports = mongoose.model("Post", postSchema);
