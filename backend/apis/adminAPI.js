import exp from "express";
import { UserModel } from '../models/UserModel.js'
import { deleteUser, deletePost,activatePost,activateUser,getAllPosts } from '../controllers/admin.js'
import { verifyToken } from "../middleware/verifyToken.js";

export const adminRoute = exp.Router()

//get all the users
adminRoute.get('/users', verifyToken("ADMIN"),async (req, res) => {
    //find all the users
    let users = await UserModel.find()
    //if not found
    if (!users) {
        return res.status(404).json({ message: "no users found! please add the users" })
    }
    //return res
    res.status(200).json({ message: "users: ", payload: users })
})

//get all posts
adminRoute.get('/posts', verifyToken("ADMIN"), getAllPosts);

//block user
adminRoute.delete('/del-user/:userId',verifyToken("ADMIN"), deleteUser)
//remove the post
adminRoute.delete('/del-post/:postId', verifyToken("ADMIN"),deletePost)
//activate the user
adminRoute.patch('/activate-user/:userId', verifyToken("ADMIN"), activateUser);
//activate the post
adminRoute.patch('/activate-post/:postId', verifyToken("ADMIN"), activatePost);