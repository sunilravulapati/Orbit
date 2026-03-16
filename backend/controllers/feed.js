import { PostModel } from "../models/PostModel.js"
import { UserModel } from "../models/UserModel.js"

export const getFeed = async (req, res, next) => {
    const userId = req.user.userId
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    //get current user
    const user = await UserModel.findById(userId)

    //users that current user follows
    const followingIds = user.following.map(
        f => f.userId
    )

    //include own posts also
    followingIds.push(userId)

    //fetch posts
    let posts = await PostModel.find({
        author: { $in: followingIds },
        isActive: true
    })
        .populate("author", "firstName lastName profileImageUrl")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

    //calculate engagement score
    const feed = posts.map(post => {

        const likes = post.likes.length
        const comments = post.comments.length

        const hoursOld =
            (Date.now() - new Date(post.createdAt)) / (1000 * 60 * 60)

        const score =
            (likes * 2) +
            (comments * 3) -
            hoursOld * 0.1

        return {
            ...post.toObject(),
            likesCount: likes,
            commentsCount: comments,
            score
        }
    })

    //sort by score
    feed.sort((a, b) => b.score - a.score)

    res.json({
        message: "feed fetched",
        page,
        count: feed.length,
        payload: feed
    })
}