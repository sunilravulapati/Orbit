import { UserModel } from "../models/UserModel.js"
import {PostModel} from '../models/PostModel.js'

//remove the user(deactivate the user):soft delete
export const deleteUser = async (req, res) => {
    //get the user id
    const { userId } = req.params
    //find and do soft delete
    await UserModel.findByIdAndUpdate(userId, {
        isActive: false
    })
    //send the res
    res.json({ message: "user removed" })
}

//activate the user
export const activateUser = (async (req, res) => {
    const { userId } = req.params;
    await UserModel.findByIdAndUpdate(userId, { isActive: true });
    res.json({ message: "User account reactivated" });
});

//remove the post(deactivate the user):soft delete
export const deletePost = async (req, res) => {
    //get the post id
    const { postId } = req.params
    //find and update the post
    await PostModel.findByIdAndUpdate(postId, {
        isActive: false
    })  
    //send the res
    res.json({ message: "post removed" })
}

// Reactivate Post
export const activatePost = (async (req, res) => {
    const { postId } = req.params;
    await PostModel.findByIdAndUpdate(postId, { isActive: true });
    res.json({ message: "Post restored successfully" });
});

// get all posts for admin (including inactive)
export const getAllPosts = async (req, res) => {
    const posts = await PostModel.find()
        .populate("author", "username firstName lastName profileImageUrl")
        .sort({ createdAt: -1 });

    res.status(200).json({ message: "all posts", payload: posts });
};