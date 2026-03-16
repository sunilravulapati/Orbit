import cloudinary from "../config/cloudinary.js";
import { PostModel } from "../models/PostModel.js";

export const createPost = async (req, res) => {
    try {

        let imageData = {};

        if (req.file) {

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "posts"
            });

            imageData = {
                url: result.secure_url,
                public_id: result.public_id
            };
        }

        const newPost = new PostModel({
            author: req.body.author,
            text: req.body.text,
            image: imageData
        });

        await newPost.save();

        res.json({ message: "Post created", payload: newPost });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};