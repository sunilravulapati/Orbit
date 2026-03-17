import exp from "express";
import { UserModel } from '../models/UserModel.js'
import { PostModel } from '../models/PostModel.js' // 👈 was missing!
import { verifyToken } from "../middleware/verifyToken.js";

export const userRoute = exp.Router()

// get all users
userRoute.get('/users', async (req, res) => {
    let users = await UserModel.find()
    if (!users) {
        return res.status(404).json({ message: "no users found!" })
    }
    res.status(200).json({ message: "users: ", payload: users })
});

// follow user
userRoute.post("/follow/:userId", verifyToken("USER"), async (req, res) => {
    const followerId = req.user.userId;
    const followingId = req.params.userId;

    if (followerId === followingId) {
        return res.status(400).json({ message: "cannot follow yourself" });
    }

    const followerUser = await UserModel.findById(followerId);
    const followingUser = await UserModel.findById(followingId);
    if (!followerUser || !followingUser) {
        return res.status(404).json({ message: "user not found" });
    }

    const alreadyFollowing = followerUser.following.some(
        (f) => f.userId.toString() === followingId
    );
    if (alreadyFollowing) {
        return res.status(400).json({ message: "already following this user" });
    }

    followerUser.following.push({ userId: followingId });
    followingUser.followers.push({ userId: followerId });
    await followerUser.save();
    await followingUser.save();

    res.status(200).json({ message: "followed successfully" });
});

// unfollow user
userRoute.post("/unfollow/:userId", verifyToken("USER"), async (req, res) => {
    const followerId = req.user.userId;
    const followingId = req.params.userId;

    const followerUser = await UserModel.findById(followerId);
    const followingUser = await UserModel.findById(followingId);
    if (!followerUser || !followingUser) {
        return res.status(404).json({ message: "user not found" });
    }

    followerUser.following = followerUser.following.filter(
        (f) => f.userId.toString() !== followingId
    );
    followingUser.followers = followingUser.followers.filter(
        (f) => f.userId.toString() !== followerId
    );

    await followerUser.save();
    await followingUser.save();

    res.status(200).json({ message: "unfollowed successfully" });
});

// get followers
userRoute.get("/followers/:userId", verifyToken("USER"), async (req, res) => {
    const user = await UserModel.findById(req.params.userId)
        .populate("followers.userId", "firstName lastName profileImageUrl");
    res.status(200).json({ message: "followers fetched", payload: user.followers });
});

// get following
userRoute.get("/following/:userId", verifyToken("USER"), async (req, res) => {
    const user = await UserModel.findById(req.params.userId)
        .populate("following.userId", "firstName lastName profileImageUrl");
    res.status(200).json({ message: "following fetched", payload: user.following });
});

// update user profile
userRoute.patch('/update-user', verifyToken('USER'), async (req, res) => {
    const userId = req.user.userId;
    const updates = req.body;

    const allowedUpdates = ["firstName", "lastName", "username", "bio", "profileImageUrl"];
    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
        if (allowedUpdates.includes(key)) filteredUpdates[key] = updates[key];
    });

    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $set: filteredUpdates },
        { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated successfully", payload: updatedUser });
});

// toggle bookmark
userRoute.put('/bookmarks/:postId', verifyToken("USER"), async (req, res) => { // 👈 fixed: verifyToken("USER")
    const userId = req.user.userId;
    const { postId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const bookmarkIndex = user.bookmarks.findIndex(
        (b) => b.postId.toString() === postId
    );

    if (bookmarkIndex > -1) {
        user.bookmarks.splice(bookmarkIndex, 1);
        await user.save();
        return res.status(200).json({ message: "Removed from bookmarks" });
    } else {
        user.bookmarks.push({ postId }); // 👈 fixed: only postId, no isActive (not in schema)
        await user.save();
        return res.status(200).json({ message: "Added to bookmarks" });
    }
});

// get bookmarks
userRoute.get('/bookmarks', verifyToken("USER"), async (req, res) => { // 👈 fixed: verifyToken("USER")
    const userId = req.user.userId;

    const user = await UserModel.findById(userId).populate({
        path: 'bookmarks.postId',
        match: { isActive: true },
        select: 'text image author likes comments createdAt',
        populate: {
            path: 'author',
            select: 'firstName username profileImageUrl' // 👈 added username
        }
    }).select('bookmarks').lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const bookmarkPosts = user.bookmarks
        .filter(b => b.postId)
        .map(b => b.postId);

    res.status(200).json({ message: "Bookmarks retrieved", payload: bookmarkPosts });
});