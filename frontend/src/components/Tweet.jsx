import React, { useState } from 'react';
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart, CiBookmark } from "react-icons/ci";
import axios from "axios";
import { POST_API_END_POINT, timeSince } from '../utils/constant';
import toast from "react-hot-toast";
import useUserStore from '../store/useUserStore';
import useTweetStore from '../store/useTweetStore';

const Tweet = ({ tweet }) => {
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [commentText, setCommentText] = useState("");

    const user = useUserStore((state) => state.user);
    const toggleRefresh = useTweetStore((state) => state.toggleRefresh);
    const toggleBookmark = useTweetStore((state) => state.toggleBookmark);
    const bookmarks = useTweetStore((state) => state.bookmarks);

    const likeOrDislikeHandler = async (id) => {
        try {
            const isLiked = tweet?.likes?.some(like => like.userId === user?.userId);
            if (isLiked) {
                await axios.post(`${POST_API_END_POINT}/${id}/unlike`, {}, { withCredentials: true });
                toast.success("Post unliked");
            } else {
                await axios.post(`${POST_API_END_POINT}/${id}/like`, {}, { withCredentials: true });
                toast.success("Post liked");
            }
            toggleRefresh();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Something went wrong");
        }
    };

    const commentHandler = async (postId) => {
        if (!commentText.trim()) return toast.error("Comment cannot be empty");
        try {
            await axios.post(
                `${POST_API_END_POINT}/${postId}/comment`,
                { text: commentText },
                { withCredentials: true }
            );
            toast.success("Comment added!");
            setCommentText("");
            setActiveCommentId(null);
            toggleRefresh();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to comment");
        }
    };

    // Step 1 — show confirmation toast
    const deleteTweetHandler = (postId) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-800">
                    Are you sure you want to delete this?
                </span>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-black transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            confirmDelete(postId); // 👈 dismiss first, then delete
                        }}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 5000, position: 'top-center' });
    };

    // Step 2 — actually delete
    const confirmDelete = async (postId) => {
        try {
            await axios.delete(
                `${POST_API_END_POINT}/delete-post/${postId}`, // 👈 fixed: was /delete/, correct route is /delete-post/
                { withCredentials: true }
            );
            toast.success("Post deleted");
            toggleRefresh();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Delete failed");
        }
    };

    const isLiked = tweet?.likes?.some(like => like.userId === user?.userId);
    const isBookmarked = bookmarks.some((b) => b._id === tweet?._id);
    const authorName = tweet?.author?.firstName || tweet?.author?.username || "User";

    return (
        <div className='border-b border-orbit-border hover:bg-orbit-card transition-colors cursor-pointer'>
            <div className='flex gap-3 p-4'>
                <div className='w-9 h-9 rounded-full bg-orbit-teal-dark border-2 border-orbit-teal flex items-center justify-center text-orbit-teal font-medium text-sm shrink-0'>
                    {tweet?.author?.profileImageUrl ? (
                        <img src={tweet.author.profileImageUrl} alt="avatar" className='w-full h-full rounded-full object-cover' />
                    ) : (
                        authorName[0]?.toUpperCase()
                    )}
                </div>

                <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                        <h1 className='font-medium text-sm text-orbit-text'>{authorName}</h1>
                        <p className='text-orbit-faint text-xs'>{`@${tweet?.author?.username} · ${timeSince(tweet?.createdAt)}`}</p>
                    </div>

                    <p className='text-orbit-muted text-sm mt-1 leading-relaxed'>{tweet?.text}</p>

                    {tweet?.image?.url && (
                        <img src={tweet.image.url} alt="post" className='mt-2 rounded-xl max-h-64 object-cover border border-orbit-border' />
                    )}

                    <div className='flex items-center gap-6 mt-3'>

                        {/* Comment */}
                        <div
                            onClick={() => {
                                setActiveCommentId(activeCommentId === tweet._id ? null : tweet._id);
                                setCommentText("");
                            }}
                            className={`flex items-center gap-1 transition-colors cursor-pointer ${activeCommentId === tweet._id ? 'text-orbit-teal' : 'text-orbit-faint hover:text-orbit-teal'}`}
                        >
                            <FaRegComment size="15px" />
                            <span className='text-xs'>{tweet?.comments?.length || 0}</span>
                        </div>

                        {/* Like */}
                        <div
                            onClick={() => likeOrDislikeHandler(tweet?._id)}
                            className={`flex items-center gap-1 transition-colors cursor-pointer ${isLiked ? 'text-pink-400' : 'text-orbit-faint hover:text-pink-400'}`}
                        >
                            <CiHeart size="17px" />
                            <span className='text-xs'>{tweet?.likes?.length || 0}</span>
                        </div>

                        {/* Bookmark */}
                        <div
                            onClick={() => toggleBookmark(tweet)}
                            className={`flex items-center gap-1 transition-colors cursor-pointer ${isBookmarked ? 'text-orbit-teal' : 'text-orbit-faint hover:text-orbit-teal'}`}
                        >
                            <CiBookmark size="17px" />
                        </div>

                        {/* Delete — only visible to post author */}
                        {user?.userId === tweet?.author?._id && (
                            <div
                                onClick={() => deleteTweetHandler(tweet?._id)}
                                className='flex items-center gap-1 text-orbit-faint hover:text-red-400 transition-colors cursor-pointer'
                            >
                                <MdOutlineDeleteOutline size="17px" />
                            </div>
                        )}
                    </div>

                    {/* Comment input */}
                    {activeCommentId === tweet._id && (
                        <div className='mt-3 flex gap-2'>
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && commentHandler(tweet._id)}
                                placeholder="Write a comment..."
                                className="flex-1 bg-orbit-bg border border-orbit-border rounded-lg px-3 py-1.5 text-xs text-orbit-text outline-none focus:border-orbit-teal transition-colors"
                                autoFocus
                            />
                            <button
                                onClick={() => commentHandler(tweet._id)}
                                className="bg-orbit-teal-dark text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-orbit-teal transition-colors"
                            >
                                Reply
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tweet;