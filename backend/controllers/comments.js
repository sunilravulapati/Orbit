import { PostModel } from "../models/PostModel.js";

//add comments
export const addComment = async (req,res) => {
    //get the post and user and text details
    let {postId} = req.params;
    let {userId,text} = req.body;
    //find the post
    let post = await PostModel.findById(postId);
    if(!post){
        return res.status(404).json({message:"post not found!"})
    }
    //push the comments to the post
    post.comments.push({userId,text})
    //save it to db
    await post.save();
    //send res
    res.status(200).json({message:"added the comments"})
}

//remove comments
export const removeComment = async (req,res) => {
    //get the details
    let {postId,commentId} = req.params;
    //find the post
    let post = await PostModel.findById(postId);
    if(!post){
        return res.status(404).json({message:"post not found!"}) 
    }
    //remove the comment
    post.comments = post.comments.filter(comment => comment._id.toString() !== commentId )
    //save it in the db
    await post.save();
    //send res
    res.status(200).json({message:"removed the comments"})
}

//get the comments of a post
export const getComments = async(req,res)=>{
    //get the details
    let {postId} = req.params;
    let post = await PostModel.findById(postId).populate("comments.userId","firstName lastName profileImageUrl")
    if(!post){
        return res.status(404).json({message:"post not found!"}) 
    }
    //send res
    res.status(200).json({message:"comments of the post: ",payload:post.comments})
}