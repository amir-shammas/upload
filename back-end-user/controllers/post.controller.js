const userModel = require("./../models/user.model");
const postModel = require("./../models/post.model");


exports.createNewPost = async (req, res, next) => {
    try{
        const { content } = req.body;
        const userId = String(req.user._id);
        await postModel.createNewPostValidation(req.body).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const newPost = await postModel.create({
            content,
            user: userId,
        });
        if(!newPost){
            return res.status(400).json({status: 400, message: "fail to create new post !"});
        }
        // Update the user to include the new post ID
        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            $push: { posts: newPost._id } // Push the new post ID into the user's posts array
        });
        if(!updatedUser){
            return res.status(404).json({status: 404, message: "fail to update user !"});
        }
        return res.status(201).json({status: 201, message: "post created successfully !", newPost });
    }catch(error){
        next(error);
    }
};


exports.getAllPosts = async (req, res, next) => {
    try{
        const allPosts = await postModel.find().populate("user");
        if(!allPosts){
            return res.status(404).json({status: 404, message: "fail to get all posts !"});
        }
        return res.status(200).json({status: 200, message: "get all posts successfully !", allPosts});
    }catch(error){
        next(error);
    }
};


exports.getOnePost = async (req, res, next) => {
    try{
        const { id } = req.params;
        await postModel.getOnePostValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const onePost = await postModel.findById(id).populate("user");
        if(!onePost){
            return res.status(404).json({status: 404, message: "fail to get one post !"});
        }
        return res.status(200).json({status: 200, message: "get one post successfully !", onePost});
    }catch(error){
        next(error);
    }
};


exports.getMyPosts = async (req, res, next) => {
    try{
        const myPosts = await postModel.find({user: req.user._id}).populate("user");
        if (!myPosts) {
            return res.status(404).json({status: 404, message: "fail to get my posts !"});
        }
        return res.status(200).json({status: 200, message: "get my posts successfully !", myPosts});
    }catch(error){
        next(error);
    }
};


exports.getMyPost = async (req, res, next) => {
    try{
        const { id } = req.params;
        await postModel.getMyPostValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const myPost = await postModel.findById(id).populate("user");
        if (!myPost) {
            return res.status(404).json({status: 404, message: "fail to get my post !"});
        }
        return res.status(200).json({status: 200, message: "get my post successfully !", myPost});
    }catch(error){
        next(error);
    }
};


exports.updateMyPost = async (req, res, next) => {
  try{
    const { content } = req.body;
    const { id } = req.params;
    await postModel.updateMyPostValidation({ id , content }).catch((err) => {
        err.statusCode = 400;
        throw err;
    });
    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      {
        content,
      },
      { new: true },
    );
    if (!updatedPost) {
        return res.status(404).json({status: 404, message: "fail to update my post !"});
    }
    return res.status(200).json({status: 200, message: "post updated successfully !", data: updatedPost});
  }catch(error){
    next(error);
  }
};


exports.deleteMyPost = async (req, res, next) => {
    try{
        const { id } = req.params;
        await postModel.deleteMyPostValidation({ id }).catch((err) => {
            err.statusCode = 400;
            throw err;
        });
        const deletedPost = await postModel.findByIdAndDelete(
            id,
        );
        if (!deletedPost) {
            return res.status(404).json({status: 404, message: "fail to delete my post !"});
        }
        // Remove the post ID from the user's posts array
        const updatedUser = await userModel.findByIdAndUpdate(deletedPost.user, { $pull: { posts: id } });
        if(!updatedUser){
            return res.status(404).json({status: 404, message: "fail to update user !"});
        }
        return res.status(200).json({status: 200, message: "post deleted successfully !", data: deletedPost});
    }catch(error){
        next(error);
    }
};
