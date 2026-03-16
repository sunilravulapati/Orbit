import { UserModel } from "../models/UserModel.js"

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