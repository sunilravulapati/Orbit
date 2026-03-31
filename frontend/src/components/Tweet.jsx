import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { AiFillHeart } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import axios from "axios";
import { POST_API_END_POINT, timeSince } from '../utils/constant';
import toast from "react-hot-toast";
import useUserStore from '../store/useUserStore';
import useTweetStore from '../store/useTweetStore';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const resolveAuthorName = (author) => {
    if (!author) return null;
    if (typeof author === 'string') return author;
    const first = author.firstName?.trim();
    const last = author.lastName?.trim();
    if (first) return last ? `${first} ${last}` : first;
    if (author.name?.trim()) return author.name.trim();
    if (author.username?.trim()) return author.username.trim();
    return null;
};

const resolveAvatar = (author) => {
    if (!author || typeof author === 'string') return null;
    return author.profileImageUrl || author.avatar || author.avatarUrl || null;
};

// ── AI Reply Suggestions ──────────────────────────────────────────────────────
const fetchAISuggestions = async (postText) => {
    if (!GROQ_API_KEY || !postText?.trim()) return [];
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama3-8b-8192",
            max_tokens: 120,
            temperature: 0.8,
            messages: [{
                role: "user",
                content: `Generate exactly 3 short, natural, conversational reply suggestions for this social media post: "${postText}"

Rules:
- Each reply must be under 12 words
- Sound human and casual, not robotic
- Vary the tone: one agreeable, one curious/questioning, one witty or playful
- Return ONLY a valid JSON array of 3 strings, nothing else
- Example format: ["Great point!", "How did you get started with this?", "Classic situation 😄"]`
            }]
        })
    });
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content?.trim();
    // Strip markdown fences if present
    const clean = raw?.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
};

const Tweet = ({ tweet }) => {
    const navigate = useNavigate();
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const user = useUserStore((state) => state.user);
    const toggleRefresh = useTweetStore((state) => state.toggleRefresh);
    const toggleBookmark = useTweetStore((state) => state.toggleBookmark);
    const bookmarks = useTweetStore((state) => state.bookmarks);

    const openCommentBox = async (e) => {
        e.stopPropagation();
        const isOpening = activeCommentId !== tweet._id;
        setActiveCommentId(isOpening ? tweet._id : null);
        setCommentText("");
        setSuggestions([]);

        if (isOpening && tweet?.text?.trim()) {
            setLoadingSuggestions(true);
            try {
                const results = await fetchAISuggestions(tweet.text);
                setSuggestions(Array.isArray(results) ? results : []);
            } catch {
                // Silently fail — suggestions are non-critical
                setSuggestions([]);
            } finally {
                setLoadingSuggestions(false);
            }
        }
    };

    const likeOrDislikeHandler = async (e, id) => {
        e.stopPropagation();
        try {
            const isLiked = tweet?.likes?.some(
                l => (l.userId?._id ?? l.userId)?.toString() === user?.userId
            );
            if (isLiked) {
                await axios.post(`${POST_API_END_POINT}/${id}/unlike`, {}, { withCredentials: true });
            } else {
                await axios.post(`${POST_API_END_POINT}/${id}/like`, {}, { withCredentials: true });
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
            toast.success("Replied!");
            setCommentText("");
            setActiveCommentId(null);
            setSuggestions([]);
            toggleRefresh();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to reply");
        }
    };

    const deleteTweetHandler = (e, postId) => {
        e.stopPropagation();
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[220px]">
                <span className="text-sm font-semibold text-orbit-text">Delete this post?</span>
                <span className="text-xs text-orbit-muted">This can't be undone.</span>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="text-xs border border-orbit-border hover:bg-orbit-surface px-3 py-1.5 rounded-full text-orbit-muted font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { toast.dismiss(t.id); confirmDelete(postId); }}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full font-medium transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 6000, position: 'top-center' });
    };

    const confirmDelete = async (postId) => {
        try {
            await axios.delete(`${POST_API_END_POINT}/delete-post/${postId}`, { withCredentials: true });
            toast.success("Post deleted");
            toggleRefresh();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Delete failed");
        }
    };

    const isLiked = tweet?.likes?.some(
        l => (l.userId?._id ?? l.userId)?.toString() === user?.userId
    );
    const isBookmarked = bookmarks.some((b) => b._id === tweet?._id);

    const authorName = resolveAuthorName(tweet?.author) || "Unknown";
    const authorUsername = tweet?.author?.username || "";
    const authorAvatar = resolveAvatar(tweet?.author);
    const authorId = tweet?.author?._id || tweet?.author;
    const avatarLetter = (authorName !== "Unknown" ? authorName : authorUsername || "?")[0]?.toUpperCase();

    return (
        <article
            className='border-b border-orbit-border hover:bg-orbit-surface/40 transition-colors cursor-pointer'
            onClick={() => tweet?._id && navigate(`/tweet/${tweet._id}`)}
        >
            <div className='flex gap-3 px-4 pt-4 pb-3'>

                {/* Avatar */}
                <Link
                    to={authorId ? `/profile/${authorId}` : "#"}
                    onClick={(e) => e.stopPropagation()}
                    className='w-10 h-10 rounded-full bg-orbit-surface border border-orbit-border flex items-center justify-center text-orbit-teal font-semibold text-sm shrink-0 overflow-hidden hover:opacity-90 transition-opacity'
                >
                    {authorAvatar ? (
                        <img src={authorAvatar} alt="avatar" className='w-full h-full object-cover'
                            onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                        <span>{avatarLetter}</span>
                    )}
                </Link>

                <div className='flex-1 min-w-0'>
                    {/* Author row */}
                    <div className='flex items-baseline gap-1.5 flex-wrap'>
                        <Link
                            to={authorId ? `/profile/${authorId}` : "#"}
                            onClick={(e) => e.stopPropagation()}
                            className='font-bold text-[14px] text-orbit-text hover:underline leading-tight'
                        >
                            {authorName}
                        </Link>
                        {authorUsername && (
                            <span className='text-orbit-muted text-[13px] truncate'>
                                @{authorUsername} · {timeSince(tweet?.createdAt)}
                            </span>
                        )}
                    </div>

                    {/* Text */}
                    <p className='text-[14px] text-orbit-text mt-1 leading-relaxed whitespace-pre-wrap break-words'>
                        {tweet?.text}
                    </p>

                    {/* Image */}
                    {tweet?.image?.url && (
                        <div className='mt-3 rounded-2xl overflow-hidden border border-orbit-border'>
                            <img src={tweet.image.url} alt="post"
                                className='max-h-72 w-full object-cover'
                                onClick={(e) => e.stopPropagation()}
                                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className='flex items-center gap-1 mt-3 -ml-1.5'>
                        <ActionBtn
                            onClick={openCommentBox}
                            active={activeCommentId === tweet._id}
                            activeColor="text-orbit-teal"
                            hoverBg="hover:bg-orbit-teal/10"
                            icon={<FaRegComment size={15} />}
                            count={tweet?.comments?.length || 0}
                        />
                        <ActionBtn
                            onClick={(e) => likeOrDislikeHandler(e, tweet?._id)}
                            active={isLiked}
                            activeColor="text-pink-400"
                            hoverBg="hover:bg-pink-400/10"
                            icon={isLiked
                                ? <AiFillHeart size={17} className="text-pink-400" />
                                : <CiHeart size={17} />}
                            count={tweet?.likes?.length || 0}
                        />
                        <ActionBtn
                            onClick={(e) => { e.stopPropagation(); toggleBookmark(tweet); }}
                            active={isBookmarked}
                            activeColor="text-orbit-teal"
                            hoverBg="hover:bg-orbit-teal/10"
                            icon={<CiBookmark size={17} />}
                        />
                        {user?.userId === authorId?.toString() && (
                            <ActionBtn
                                onClick={(e) => deleteTweetHandler(e, tweet?._id)}
                                active={false}
                                activeColor="text-red-400"
                                hoverBg="hover:bg-red-400/10"
                                hoverText="hover:text-red-400"
                                icon={<MdOutlineDeleteOutline size={17} />}
                            />
                        )}
                    </div>

                    {/* Comment box + AI suggestions */}
                    {activeCommentId === tweet._id && (
                        <div
                            className='mt-3 border-t border-orbit-border pt-3'
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* ── AI Suggestions ── */}
                            {loadingSuggestions ? (
                                <div className='flex items-center gap-2 mb-3 px-1'>
                                    <BsStars size={13} className='text-orbit-teal animate-pulse' />
                                    <span className='text-[12px] text-orbit-muted'>Getting AI suggestions…</span>
                                </div>
                            ) : suggestions.length > 0 && (
                                <div className='mb-3'>
                                    <div className='flex items-center gap-1.5 mb-2 px-1'>
                                        <BsStars size={12} className='text-orbit-teal' />
                                        <span className='text-[11px] text-orbit-muted font-medium tracking-wide uppercase'>
                                            AI Suggestions
                                        </span>
                                    </div>
                                    <div className='flex flex-wrap gap-2'>
                                        {suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCommentText(s)}
                                                className='text-[12px] px-3 py-1.5 rounded-full border border-orbit-teal/30 text-orbit-teal bg-orbit-teal/5 hover:bg-orbit-teal/15 hover:border-orbit-teal/60 transition-all leading-snug text-left'
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input row */}
                            <div className='flex gap-2'>
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && commentHandler(tweet._id)}
                                    placeholder="Post your reply"
                                    className="flex-1 bg-orbit-bg border border-orbit-border rounded-full px-4 py-2 text-[13px] text-orbit-text placeholder:text-orbit-muted outline-none focus:border-orbit-teal transition-colors"
                                    autoFocus
                                />
                                <button
                                    onClick={() => commentHandler(tweet._id)}
                                    disabled={!commentText.trim()}
                                    className="bg-orbit-teal text-orbit-bg px-4 py-1.5 rounded-full text-[13px] font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Reply
                                </button>
                            </div>

                            {/* Existing comments */}
                            {tweet?.comments?.length > 0 && (
                                <div className='mt-4 flex flex-col gap-3'>
                                    {tweet.comments.map((comment, idx) => {
                                        const cName = resolveAuthorName(comment.userId) || "User";
                                        const cAvatar = resolveAvatar(comment.userId);
                                        const cLetter = cName[0]?.toUpperCase();
                                        return (
                                            <div key={comment._id || idx} className='flex gap-3'>
                                                <Link
                                                    to={`/profile/${comment.userId?._id || comment.userId}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className='w-8 h-8 rounded-full bg-orbit-surface border border-orbit-border flex items-center justify-center text-orbit-teal font-medium text-xs shrink-0 overflow-hidden'
                                                >
                                                    {cAvatar ? (
                                                        <img src={cAvatar} alt="avatar" className='w-full h-full object-cover'
                                                            onError={(e) => { e.target.style.display = 'none'; }} />
                                                    ) : cLetter}
                                                </Link>
                                                <div className='flex-1 bg-orbit-surface rounded-2xl px-3 py-2'>
                                                    <div className='flex items-baseline gap-1.5'>
                                                        <Link
                                                            to={`/profile/${comment.userId?._id || comment.userId}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className='font-semibold text-[13px] text-orbit-text hover:underline'
                                                        >
                                                            {cName}
                                                        </Link>
                                                        <span className='text-[11px] text-orbit-muted'>{timeSince(comment.createdAt)}</span>
                                                    </div>
                                                    <p className='text-orbit-text text-[13px] mt-0.5 leading-snug'>{comment.text}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

const ActionBtn = ({ onClick, active, activeColor, hoverBg, hoverText = "", icon, count }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-full transition-colors text-orbit-muted ${hoverBg} ${hoverText} ${active ? activeColor : ''}`}
    >
        {icon}
        {count !== undefined && count > 0 && (
            <span className={`text-[12px] ${active ? activeColor : ''}`}>{count}</span>
        )}
    </button>
);

export default Tweet;