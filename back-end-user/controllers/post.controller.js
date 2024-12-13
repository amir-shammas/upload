const userModel = require("./../models/user.model");
const postModel = require("./../models/post.model");


exports.createPost = async (req, res, next) => {
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
