import exp from "express";
import { UserModel } from '../models/UserModel.js'
import { deleteUser, deletePost } from '../controllers/admin.js'

export const adminRoute = exp.Router()

//get all the users
adminRoute.get('/users', async (req, res) => {
    //find all the users
    let users = await UserModel.find()
    //if not found
    if (!users) {
        return res.status(404).json({ message: "no users found! please add the users" })
    }
    //return res
    res.status(200).json({ message: "users: ", payload: users })
})

//block user
adminRoute.delete('/del-user/:userId', deleteUser)
//remove the post
adminRoute.delete('/del-post/:postId', deletePost)