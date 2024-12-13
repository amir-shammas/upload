const postModel = require("./../models/post.model");

module.exports = async (req, res, next) => {
    const { id } = req.params;
    const isMyPost = await postModel.findOne({
        $and: [{ _id: id }, { user: req.user._id }],
    });
    if (isMyPost) return next();
    return res
      .status(403)
      .json({ message: "You are not the author of this post !" });
};
