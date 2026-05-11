import { PostModel } from "../models/PostModel.js"
import { UserModel } from "../models/UserModel.js"

// Exponential time decay — half-life of ~8 hours
// Score drops to 50% after 8hrs, 25% after 16hrs, etc.
const timeDecay = (createdAt) => {
    const ageInHours = (Date.now() - new Date(createdAt)) / 3_600_000;
    return Math.exp(-0.087 * ageInHours); // ln(2)/8 ≈ 0.087
};

// Cap posts per author to prevent feed domination
const diversifyFeed = (posts, maxPerAuthor = 2) => {
    const authorCount = {};
    return posts.filter(post => {
        const authorId = post.author._id.toString();
        authorCount[authorId] = (authorCount[authorId] || 0) + 1;
        return authorCount[authorId] <= maxPerAuthor;
    });
};

export const getFeed = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const tab = req.query.tab || "foryou"; // "foryou" | "following"

        // Get current user with following list
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const followingIds = user.following.map(f => f.userId.toString());
        const followingSet = new Set(followingIds);

        if (tab === "following") {
            // ── FOLLOWING TAB: pure chronological, only followed users ──
            const posts = await PostModel.find({
                author: { $in: [...followingIds, userId] },
                isActive: true
            })
                .populate("author", "firstName lastName username profileImageUrl")
                .populate("comments.userId", "firstName lastName username profileImageUrl")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            return res.json({
                message: "feed fetched",
                tab,
                page,
                count: posts.length,
                payload: posts
            });
        }

        // ── FOR YOU TAB: scored algorithm ──

        // Fetch a wider pool to score and filter down
        // Mix: posts from followed users + discovery posts from non-followed
        const poolSize = limit * 6;

        const [followingPosts, discoveryPosts] = await Promise.all([
            // Posts from people you follow (larger share)
            PostModel.find({
                author: { $in: [...followingIds, userId] },
                isActive: true
            })
                .populate("author", "firstName lastName username profileImageUrl")
                .populate("comments.userId", "firstName lastName username profileImageUrl")
                .sort({ createdAt: -1 })
                .limit(Math.floor(poolSize * 0.7)),

            // Discovery: posts from non-followed users (30% of pool)
            PostModel.find({
                author: { $nin: [...followingIds, userId] },
                isActive: true
            })
                .populate("author", "firstName lastName username profileImageUrl")
                .populate("comments.userId", "firstName lastName username profileImageUrl")
                .sort({ createdAt: -1 })
                .limit(Math.floor(poolSize * 0.3))
        ]);

        const allPosts = [...followingPosts, ...discoveryPosts];

        // Get mutual followers for social proof boost
        // (followers of people you follow)
        const followersOfFollowing = new Set();
        if (followingIds.length > 0) {
            const followedUsers = await UserModel.find(
                { _id: { $in: followingIds } },
                { followers: 1 }
            );
            followedUsers.forEach(fu => {
                fu.followers.forEach(f => {
                    const fId = f.userId?.toString();
                    if (fId && fId !== userId) followersOfFollowing.add(fId);
                });
            });
        }

        // Score each post
        const scored = allPosts.map(post => {
            const authorId = post.author._id.toString();
            const likes = post.likes.length;
            const comments = post.comments.length;
            const bookmarks = post.bookmarks?.length || 0;
            const decay = timeDecay(post.createdAt);

            // Base engagement score
            let score = (likes * 2 + comments * 3 + bookmarks * 4) * decay;

            // +30 if you follow the author
            if (followingSet.has(authorId)) score += 30;

            // +10 if author is a mutual-follower-of-following (social proof)
            if (followersOfFollowing.has(authorId)) score += 10;

            // +5 if the post has an image (richer content)
            if (post.image?.url) score += 5;

            // +15 if it's your own post
            if (authorId === userId) score += 15;

            // Small random jitter (0-2) to avoid identical scores looking stale
            score += Math.random() * 2;

            return {
                ...post.toObject(),
                likesCount: likes,
                commentsCount: comments,
                score: parseFloat(score.toFixed(4))
            };
        });

        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);

        // Diversify: max 2 posts per author in the final feed
        const diversified = diversifyFeed(scored, 2);

        // Paginate after scoring (score-based pagination)
        const start = (page - 1) * limit;
        const paginated = diversified.slice(start, start + limit);

        res.json({
            message: "feed fetched",
            tab,
            page,
            count: paginated.length,
            hasMore: diversified.length > start + limit,
            payload: paginated
        });

    } catch (error) {
        console.error("Feed error:", error);
        next(error);
    }
};