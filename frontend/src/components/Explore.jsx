import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import axios from "axios";
import { POST_API_END_POINT, timeSince } from '../utils/constant';
import { FaRegComment } from "react-icons/fa";
import { CiHeart, CiBookmark } from "react-icons/ci";
import useUserStore from '../store/useUserStore';
import useTweetStore from '../store/useTweetStore';
import toast from 'react-hot-toast';
import TweetSkeleton from './TweetSkeleton';

const Explore = () => {
    const [search, setSearch] = useState("");
    const [posts, setPosts] = useState(null);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [commentText, setCommentText] = useState("");

    const user = useUserStore((state) => state.user);
    const toggleRefresh = useTweetStore((state) => state.toggleRefresh);
    const toggleBookmark = useTweetStore((state) => state.toggleBookmark);
    const bookmarks = useTweetStore((state) => state.bookmarks);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get(`${POST_API_END_POINT}/all`, { withCredentials: true });
                setPosts(res.data.payload);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllPosts();
    }, []);

    const likeOrDislikeHandler = async (postId, isLiked) => {
        try {
            if (isLiked) {
                await axios.post(`${POST_API_END_POINT}/${postId}/unlike`, {}, { withCredentials: true });
                toast.success("Post unliked");
            } else {
                await axios.post(`${POST_API_END_POINT}/${postId}/like`, {}, { withCredentials: true });
                toast.success("Post liked");
            }
            setPosts(prev => prev.map(p => {
                if (p._id !== postId) return p;
                const alreadyLiked = p.likes.some(l => l.userId === user?.userId);
                return {
                    ...p,
                    likes: alreadyLiked
                        ? p.likes.filter(l => l.userId !== user?.userId)
                        : [...p.likes, { userId: user?.userId }]
                };
            }));
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
            // update comment count locally
            setPosts(prev => prev.map(p =>
                p._id !== postId
                    ? p
                    : { ...p, comments: [...(p.comments || []), { text: commentText }] }
            ));
            toast.success("Comment added!");
            setCommentText("");
            setActiveCommentId(null);
            toggleRefresh();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to comment");
        }
    };

    const filteredPosts = posts?.filter(post =>
        post?.text?.toLowerCase().includes(search.toLowerCase()) ||
        post?.author?.username?.toLowerCase().includes(search.toLowerCase()) ||
        post?.author?.firstName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='w-[50%] border-l border-r border-orbit-border min-h-screen'>

            {/* Header */}
            <div className='flex items-center py-2 px-3 border-b border-orbit-border bg-orbit-bg sticky top-0 z-10'>
                <Link to="/" className='p-2 rounded-full hover:bg-orbit-card cursor-pointer'>
                    <IoMdArrowBack size="24px" className='text-orbit-text' />
                </Link>
                <h1 className='font-semibold text-orbit-text ml-2'>Explore</h1>
            </div>

            {/* Search */}
            <div className='p-4 border-b border-orbit-border'>
                <div className='flex items-center gap-2 px-3 py-2 bg-orbit-card border border-orbit-border rounded-full'>
                    <CiSearch size="18px" className='text-orbit-faint shrink-0' />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='bg-transparent outline-none text-sm text-orbit-text placeholder-orbit-faint w-full'
                        placeholder='Search posts or users'
                    />
                </div>
            </div>

            {/* Posts */}
            {posts === null ? (
                [...Array(5)].map((_, i) => <TweetSkeleton key={i} />)
            ) : filteredPosts?.length === 0 ? (
                <div className='flex flex-col items-center justify-center mt-24 px-8 text-center'>
                    <div className='text-4xl mb-4'>🔭</div>
                    <h2 className='text-orbit-text font-semibold text-xl mb-2'>Nothing found</h2>
                    <p className='text-orbit-muted text-sm'>Try searching for something else.</p>
                </div>
            ) : (
                filteredPosts?.map((post) => {
                    const isLiked = post?.likes?.some(l => l.userId === user?.userId);
                    const isBookmarked = bookmarks.some((b) => b._id === post._id);
                    const authorName = post?.author?.firstName || post?.author?.username || "User";

                    return (
                        <div key={post._id} className='border-b border-orbit-border hover:bg-orbit-card transition-colors cursor-pointer'>
                            <div className='flex gap-3 p-4'>
                                {/* Avatar */}
                                <div className='w-9 h-9 rounded-full bg-orbit-teal-dark border-2 border-orbit-teal flex items-center justify-center text-orbit-teal font-medium text-sm shrink-0 overflow-hidden'>
                                    {post?.author?.profileImageUrl ? (
                                        <img src={post.author.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                                    ) : (
                                        authorName[0]?.toUpperCase()
                                    )}
                                </div>

                                <div className='flex-1'>
                                    {/* Author + time */}
                                    <div className='flex items-center gap-2'>
                                        <h1 className='font-medium text-sm text-orbit-text'>{authorName}</h1>
                                        <p className='text-orbit-faint text-xs'>{`@${post?.author?.username} · ${timeSince(post?.createdAt)}`}</p>
                                    </div>

                                    {/* Post text */}
                                    <p className='text-orbit-muted text-sm mt-1 leading-relaxed'>{post?.text}</p>

                                    {/* Post image */}
                                    {post?.image?.url && (
                                        <img src={post.image.url} alt="post" className='mt-2 rounded-xl max-h-64 object-cover border border-orbit-border w-full' />
                                    )}

                                    {/* Action buttons */}
                                    <div className='flex items-center gap-6 mt-3'>

                                        {/* Comment */}
                                        <div
                                            onClick={() => {
                                                setActiveCommentId(activeCommentId === post._id ? null : post._id);
                                                setCommentText(""); // reset text when toggling
                                            }}
                                            className={`flex items-center gap-1 transition-colors cursor-pointer ${activeCommentId === post._id ? 'text-orbit-teal' : 'text-orbit-faint hover:text-orbit-teal'}`}
                                        >
                                            <FaRegComment size="15px" />
                                            <span className='text-xs'>{post?.comments?.length || 0}</span>
                                        </div>

                                        {/* Like */}
                                        <div
                                            onClick={() => likeOrDislikeHandler(post._id, isLiked)}
                                            className={`flex items-center gap-1 transition-colors cursor-pointer ${isLiked ? 'text-pink-400' : 'text-orbit-faint hover:text-pink-400'}`}
                                        >
                                            <CiHeart size="17px" />
                                            <span className='text-xs'>{post?.likes?.length || 0}</span>
                                        </div>

                                        {/* Bookmark */}
                                        <div
                                            onClick={() => toggleBookmark(post)}
                                            className={`flex items-center gap-1 transition-colors cursor-pointer ${isBookmarked ? 'text-orbit-teal' : 'text-orbit-faint hover:text-orbit-teal'}`}
                                        >
                                            <CiBookmark size="17px" />
                                        </div>
                                    </div>

                                    {/* Comment input box */}
                                    {activeCommentId === post._id && (
                                        <div className='mt-3 flex gap-2'>
                                            <input
                                                type="text"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && commentHandler(post._id)}
                                                placeholder="Write a comment..."
                                                className="flex-1 bg-orbit-bg border border-orbit-border rounded-lg px-3 py-1.5 text-xs text-orbit-text outline-none focus:border-orbit-teal transition-colors"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => commentHandler(post._id)}
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
                })
            )}
        </div>
    );
};

export default Explore;