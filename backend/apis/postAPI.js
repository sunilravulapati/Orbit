import exp from "express";
import upload from "../middleware/multer.js";
import { createPost, updatePost, deletePost, getPosts } from "../controllers/post.js";
import { likePost, unlikePost } from '../controllers/Like-Unlike.js'
import { addComment, removeComment, getComments } from '../controllers/comments.js'
import { verifyToken } from "../middleware/verifyToken.js";
import { getFeed } from "../controllers/feed.js";
import { PostModel } from "../models/PostModel.js";

export const postRoute = exp.Router();

//create post with image
postRoute.post("/create-post", verifyToken("USER"), upload.single("image"), createPost);

//update the post
postRoute.patch('/update-post/:postId', verifyToken("USER"), updatePost)

//delete the post
postRoute.delete('/delete-post/:postId', verifyToken("USER"), deletePost)

//get the posts of the user
postRoute.get("/user/:userId", verifyToken("USER"), getPosts);

//get the post by id
postRoute.get("/post/:postId", async (req, res) => {
    const post = await PostModel.findById(req.params.postId)
        .populate("author", "username firstName profileImageUrl")
        .populate("comments.userId", "username firstName lastName profileImageUrl"); // Optional: populate comment authors
    res.json({ payload: post });
});

//get all the posts 
postRoute.get("/all", async (req, res) => {
    const posts = await PostModel.find({ isActive: true })
        .populate("author", "username firstName profileImageUrl")
        .populate("comments.userId", "username firstName lastName profileImageUrl")
        .sort({ createdAt: -1 });

    res.json({ message: "all posts", payload: posts });
});
// like post
postRoute.post("/:postId/like", verifyToken("USER"), likePost);

// unlike post
postRoute.post("/:postId/unlike", verifyToken("USER"), unlikePost);

//add a comment to the post
postRoute.post("/:postId/comment", verifyToken("USER"), addComment);

//delete the comments
postRoute.delete("/:postId/comment/:commentId", verifyToken("USER"), removeComment);

//get the comments of the post
postRoute.get("/:postId/comments", verifyToken("USER"), getComments);

//feed algorithm
postRoute.get("/feed", verifyToken("USER", "ADMIN"), getFeed)