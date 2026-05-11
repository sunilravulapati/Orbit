import { PostModel } from "../models/PostModel.js";
import { sendNotification } from '../socket/index.js';

// add comments
export const addComment = async (req, res) => {
    let { postId } = req.params;
    let { text } = req.body;
    let userId = req.user?.userId;

    if (!text?.trim()) {
        return res.status(400).json({ error: "Comment cannot be empty" });
    }

    let post = await PostModel.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found!" });
    }

    post.comments.push({ userId, text });
    await post.save();

    if (post.author.toString() !== userId) {
        sendNotification(post.author.toString(), {
            type: 'comment',
            fromUserId: userId,
            fromUsername: req.user.username,
            postId: post._id,
            message: `${req.user.username} commented on your post`
        });
    }
    res.status(200).json({ message: "Comment added" });
};

// remove comments
export const removeComment = async (req, res) => {
    let { postId, commentId } = req.params;

    let post = await PostModel.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found!" });
    }

    post.comments = post.comments.filter(
        (comment) => comment._id.toString() !== commentId
    );
    await post.save();

    res.status(200).json({ message: "Comment removed" });
};

// get comments of a post
export const getComments = async (req, res) => {
    let { postId } = req.params;

    let post = await PostModel.findById(postId)
        .populate('author', 'firstName lastName username profileImageUrl bio')
        .populate('comments.userId', 'firstName lastName username profileImageUrl')
        .populate('likes.userId', '_id');
    if (!post) {
        return res.status(404).json({ message: "Post not found!" });
    }
    console.log(post)
    res.status(200).json({ message: "Comments fetched", payload: post.comments });
};