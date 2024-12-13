const userModel = require("./../models/user.model");
const postModel = require("./../models/post.model");


exports.createNewPost = async (req, res, next) => {
    const { content } = req.body;
    const userId = String(req.user._id);
    try{
        const newPost = await postModel.create({
            content,
            user: userId,
        });
        // Update the user to include the new post ID
        await userModel.findByIdAndUpdate(userId, {
            $push: { posts: newPost._id } // Push the new post ID into the user's posts array
        });
        return res.status(201).json({ message: "post created successfully !", newPost });
    }catch(error){
        console.log(error);
        next(error);
    }
};


exports.getAllPosts = async (req, res, next) => {
    try{
        const allPosts = await postModel.find().populate("user");
        return res.json({message: "get all posts successfully", allPosts});
    }catch(error){
        console.log(error);
        next(error);
    }
};


exports.getOnePost = async (req, res, next) => {
    try{
        const { id } = req.params;
        const post = await postModel.findById(id).populate("user");
        return res.json({message: "get one post successfully", post});
    }catch(error){
        console.log(error);
        next(error);
    }
};


exports.getMyPosts = async (req, res, next) => {
    try{
        const myPosts = await postModel.find({user: req.user._id}).populate("user");
        return res.json({message: "get my posts successfully", myPosts});
    }catch(error){
        console.log(error);
        next(error);
    }
};


exports.getMyPost = async (req, res, next) => {
    try{
        const { id } = req.params;
        const post = await postModel.findById(id).populate("user");
        return res.json({message: "get my post successfully", post});
    }catch(error){
        console.log(error);
        next(error);
    }
};


exports.updateMyPost = async (req, res, next) => {
  try{
    const { content } = req.body;
    const { id } = req.params;
    const post = await postModel.findByIdAndUpdate(
      id,
      {
        content,
      },
      { new: true },
    );
    if (!post) {
      return res.status(404).json("post not found !");
    }
    return res.status(200).json({status: 200, message: "post updated successfully !", data: post});
  }catch(error){
    console.log(error);
    next(error);
  }
};


exports.deleteMyPost = async (req, res, next) => {
    try{
        const { id } = req.params;
        const post = await postModel.findByIdAndDelete(
            id,
        );
        if (!post) {
        return res.status(404).json("post not found !");
        }
        // Remove the post ID from the user's posts array
        await userModel.findByIdAndUpdate(post.user, { $pull: { posts: id } });
        return res.status(200).json({status: 200, message: "post deleted successfully !", data: post});
    }catch(error){
        console.error(error);
        next(error);
    }
};
