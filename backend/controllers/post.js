import cloudinary from "../config/cloudinary.js";
import { PostModel } from "../models/PostModel.js";
import { broadcastNewPost } from '../socket/index.js';

//creation of a post with image
export const createPost = async (req, res, next) => {
  try {

    const { text } = req.body;
    let imageData = {};

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "orbit_posts",
      });

      imageData = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    if (!text && !req.file) {
      return res.status(400).json({
        message: "Post cannot be empty"
      });
    }

    const newPost = new PostModel({
      author: req.user.userId,
      text: text || "",
      image: imageData
    });

    await newPost.save();

    broadcastNewPost(savedPost);

    res.status(201).json({
      message: "Post created successfully",
      payload: newPost
    });

  } catch (err) {
    next(err);
  }
};

//update the post of the user
export const updatePost = async (req, res) => {
    const { postId } = req.params
    const { text } = req.body
    const post = await PostModel.findById(postId)
    if (!post) {
        return res.status(404).json({
            message: "post not found"
        })
    }
    if (text) {
        post.text = text
    }
    await post.save()
    res.json({
        message: "post updated",
        payload: post
    })
}


//delete the post of the user
export const deletePost = async (req, res) => {
    const { postId } = req.params
    const post = await PostModel.findById(postId)
    if (!post) {
        return res.status(404).json({
            message: "post not found"
        })
    }
    post.isActive = false
    await post.save()
    res.json({
        message: "post deleted"
    })
}

//get the posts of the user
export const getPosts = async (req, res) => {
    const { userId } = req.params
    const posts = await PostModel.find({
        author: userId,
        isActive: true
    })
    .sort({ createdAt: -1 })
    .populate('author', 'firstName lastName username profileImageUrl')
    .populate('comments.userId', 'username firstName profileImageUrl') // ✅ add this

    res.json({
        message: "user posts",
        payload: posts
    })
}