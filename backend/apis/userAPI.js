import exp from "express";
import { UserModel } from '../models/UserModel.js'
export const userRoute = exp.Router()

//get all users - for testing
userRoute.get('/users', async (req, res) => {
    //find all the users
    let users = await UserModel.find()
    //if not found
    if (!users) {
        return res.status(404).json({ message: "no users found! please add the users" })
    }
    //return res
    res.status(200).json({ message: "users: ", payload: users })
})

// follow user
userRoute.post("/follow/:userId", async (req, res) => {
    //get the details
    const followerId = req.body.userId; // logged in user
    const followingId = req.params.userId; // user to follow

    //check if the user is following him/her-self(not allowed)
    if (followerId === followingId) {
      return res.status(400).json({
        message: "cannot follow yourself",
      });
    }
    //find the users
    const followerUser = await UserModel.findById(followerId);
    const followingUser = await UserModel.findById(followingId);
    if (!followerUser || !followingUser) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    // check already they are already following
    const alreadyFollowing = followerUser.following.some(
      (f) => f.userId.toString() === followingId
    );
    if (alreadyFollowing) {
      return res.status(400).json({
        message: "already following this user",
      });
    }
    // update following list
    followerUser.following.push({ userId: followingId });
    // update followers list
    followingUser.followers.push({ userId: followerId });
    //save it to db
    await followerUser.save();
    await followingUser.save();
    //send res
    res.status(200).json({
      message: "followed successfully",
    });
});


// unfollow user
userRoute.post("/unfollow/:userId", async (req, res) => {
    //get the details
    const followerId = req.body.userId;
    const followingId = req.params.userId;
    
    //find the users
    const followerUser = await UserModel.findById(followerId);
    const followingUser = await UserModel.findById(followingId);
    if (!followerUser || !followingUser) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    // remove from following
    followerUser.following = followerUser.following.filter(
      (f) => f.userId.toString() !== followingId
    );
    // remove from followers
    followingUser.followers = followingUser.followers.filter(
      (f) => f.userId.toString() !== followerId
    );
    
    //save it to db
    await followerUser.save();
    await followingUser.save();
    
    //send res
    res.status(200).json({
      message: "unfollowed successfully",
    });
});


// get followers
userRoute.get("/followers/:userId", async (req, res) => {
    const user = await UserModel.findById(req.params.userId)
      .populate("followers.userId", "firstName lastName profileImageUrl");
    //send res
    res.status(200).json({
      message: "followers fetched",
      payload: user.followers,
    });
});

// get following
userRoute.get("/following/:userId", async (req, res) => {
    const user = await UserModel.findById(req.params.userId)
      .populate("following.userId", "firstName lastName profileImageUrl");
    //send res
    res.status(200).json({
      message: "following fetched",
      payload: user.following,
    });
});