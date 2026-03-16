import exp from "express";
import upload from "../middleware/multer.js";
import { createPost } from "../controllers/createPost.js";
import { likePost, unlikePost } from '../controllers/Like-Unlike.js'
import { addComment, removeComment, getComments } from '../controllers/comments.js'

export const postRoute = exp.Router();

//create post
postRoute.post("/create-post", upload.single("image"), createPost);

// like post
postRoute.post("/:postId/like", likePost);

// unlike post
postRoute.post("/:postId/unlike", unlikePost);

//add a comment to the post
postRoute.post("/:postId/comment", addComment);

//delete the comments
postRoute.delete("/:postId/comment/:commentId", removeComment);

//get the comments of the post
postRoute.get("/:postId/comments", getComments);