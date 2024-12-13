const mongoose = require("mongoose");


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


module.exports = mongoose.model("Post", postSchema);
