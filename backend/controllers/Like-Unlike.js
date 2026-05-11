import { PostModel } from "../models/PostModel.js";
import { sendNotification } from '../socket/index.js';

// post-api/:id/like
export const likePost = async (req, res) => {
    //get the postId from the req
    let { postId } = req.params;
    let userId = req.user.userId
    //find the post
    let post = await PostModel.findById(postId)
    if (!post) {
        return res.status(404).json({ message: "post not found!" })
    }
    //check if the post is already liked
    const alreadyLiked = post.likes.some(
        like => like.userId.toString() === userId
    )

    if (alreadyLiked) {
        return res.status(400).json({ message: "post already liked!" })
    }
    //mark as liked
    post.likes.push({ userId })
    //save it to db
    await post.save();
    if (post.author.toString() !== userId) {  // don't notify yourself
    sendNotification(post.author.toString(), {
        type: 'like',
        fromUserId: userId,
        fromUsername: req.user.username,  // attach this in verifyToken if not already
        postId: post._id,
        message: `${req.user.username} liked your post`
    });
}
    //res
    res.status(200).json({ message: "post liked!", payload: post.likes.length })
}

export const unlikePost = async (req, res) => {
    //get the details from the params and the body
    const { postId } = req.params
    const userId = req.user.userId
    //find the post
    const post = await PostModel.findById(postId)
    if (!post) {
        return res.status(404).json({ message: "post not found!" });
    }
    //unlike the post
    post.likes = post.likes.filter( // iterate through the likes array
        id => id.userId.toString() !== userId // Keeps only the likes where the user ID does NOT match the current user's ID
        //MongoDB stores IDs as objects, so .toString() converts them to strings for proper comparison with the incoming userId
    )
    //save it to db
    await post.save()
    //res
    res.status(200).json({ message: "post unliked!" })
}