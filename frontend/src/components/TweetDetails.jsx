import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import axios from 'axios';
import { POST_API_END_POINT, USER_API_END_POINT, timeSince } from '../utils/constant';
import toast from "react-hot-toast";
import useUserStore from '../store/useUserStore';
import useTweetStore from '../store/useTweetStore';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

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
    const clean = raw?.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
};

// ── Right sidebar ─────────────────────────────────────────────────────────────
const DetailRightSidebar = ({ relevantAuthor, otherUsers }) => {
    const [search, setSearch] = useState("");
    const filtered = (otherUsers || []).filter(u =>
        u?.username?.toLowerCase().includes(search.toLowerCase()) ||
        u?.firstName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='w-[320px] shrink-0 px-4 py-4 sticky top-0 h-screen overflow-y-auto hidden xl:block'>
            {/* Search */}
            <div className='flex items-center gap-2 px-4 py-2.5 bg-orbit-surface border border-orbit-border rounded-full mb-5 focus-within:border-orbit-teal transition-colors'>
                <CiSearch size={16} className='text-orbit-muted shrink-0' />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder='Search'
                    className='bg-transparent outline-none text-sm text-orbit-text placeholder:text-orbit-muted w-full'
                />
            </div>

            {/* Relevant people */}
            {relevantAuthor && (
                <div className='bg-orbit-surface border border-orbit-border rounded-2xl p-4 mb-4'>
                    <h2 className='font-bold text-[15px] text-orbit-text mb-3'>Relevant people</h2>
                    <div className='flex items-center justify-between gap-3'>
                        <Link to={`/profile/${relevantAuthor._id}`} className='flex items-center gap-3 min-w-0'>
                            <div className='w-10 h-10 rounded-full bg-orbit-card border border-orbit-border overflow-hidden flex items-center justify-center text-orbit-teal font-bold text-sm shrink-0'>
                                {relevantAuthor.profileImageUrl ? (
                                    <img src={relevantAuthor.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                                ) : (
                                    (relevantAuthor.firstName?.[0] || relevantAuthor.username?.[0] || 'U').toUpperCase()
                                )}
                            </div>
                            <div className='min-w-0'>
                                <p className='font-bold text-[13px] text-orbit-text truncate leading-tight'>
                                    {relevantAuthor.firstName
                                        ? `${relevantAuthor.firstName} ${relevantAuthor.lastName || ''}`.trim()
                                        : relevantAuthor.username}
                                </p>
                                <p className='text-orbit-muted text-[12px] truncate'>@{relevantAuthor.username}</p>
                                {relevantAuthor.bio && (
                                    <p className='text-orbit-muted text-[12px] mt-0.5 line-clamp-1'>{relevantAuthor.bio}</p>
                                )}
                            </div>
                        </Link>
                        <Link to={`/profile/${relevantAuthor._id}`} className='shrink-0'>
                            <button className='text-xs px-3 py-1.5 rounded-full border border-orbit-border text-orbit-text hover:bg-orbit-card font-semibold transition-colors whitespace-nowrap'>
                                Profile
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Who to follow */}
            {filtered.length > 0 && (
                <div className='bg-orbit-surface border border-orbit-border rounded-2xl p-4'>
                    <h2 className='font-bold text-[15px] text-orbit-text mb-3'>Who to follow</h2>
                    <div className='flex flex-col gap-1'>
                        {filtered.slice(0, 5).map(u => (
                            <div key={u._id} className='flex items-center justify-between gap-3 py-2'>
                                <Link to={`/profile/${u._id}`} className='flex items-center gap-2 min-w-0'>
                                    <div className='w-8 h-8 rounded-full bg-orbit-card border border-orbit-border overflow-hidden flex items-center justify-center text-orbit-teal text-xs font-bold shrink-0'>
                                        {u.profileImageUrl ? (
                                            <img src={u.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                                        ) : (
                                            (u.firstName?.[0] || u.username?.[0] || 'U').toUpperCase()
                                        )}
                                    </div>
                                    <div className='min-w-0'>
                                        <p className='font-semibold text-[12px] text-orbit-text truncate'>
                                            {u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : u.username}
                                        </p>
                                        <p className='text-orbit-muted text-[11px] truncate'>@{u.username}</p>
                                    </div>
                                </Link>
                                <Link to={`/profile/${u._id}`} className='shrink-0'>
                                    <button className='text-[11px] px-3 py-1 rounded-full border border-orbit-border text-orbit-text hover:bg-orbit-card font-medium transition-colors'>
                                        Profile
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const TweetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = useUserStore((state) => state.user);
    const toggleRefresh = useTweetStore((state) => state.toggleRefresh);
    const toggleBookmark = useTweetStore((state) => state.toggleBookmark);
    const bookmarks = useTweetStore((state) => state.bookmarks);

    const [tweet, setTweet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [otherUsers, setOtherUsers] = useState([]);

    const fetchTweet = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${POST_API_END_POINT}/post/${id}`, { withCredentials: true });
            const data = res.data?.payload ?? res.data?.data ?? res.data;
            setTweet(data);
        } catch {
            toast.error("Failed to load post");
        } finally {
            setLoading(false);
        }
    };

    const fetchOtherUsers = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/users`, { withCredentials: true });
            const users = res.data?.payload ?? res.data?.data ?? res.data ?? [];
            setOtherUsers(Array.isArray(users) ? users.filter(u => u._id !== user?.userId) : []);
        } catch { /* non-critical */ }
    };

    useEffect(() => {
        if (id) { fetchTweet(); fetchOtherUsers(); }
    }, [id]);

    // Auto-load suggestions when tweet arrives
    useEffect(() => {
        if (!tweet?.text) return;
        setLoadingSuggestions(true);
        fetchAISuggestions(tweet.text)
            .then(r => setSuggestions(Array.isArray(r) ? r : []))
            .catch(() => setSuggestions([]))
            .finally(() => setLoadingSuggestions(false));
    }, [tweet?._id]);

    const likeHandler = async () => {
        if (!tweet) return;
        const liked = tweet?.likes?.some(l => (l.userId?._id ?? l.userId)?.toString() === user?.userId);
        try {
            await axios.post(`${POST_API_END_POINT}/${tweet._id}/${liked ? 'unlike' : 'like'}`, {}, { withCredentials: true });
            toggleRefresh(); fetchTweet();
        } catch (e) { toast.error(e?.response?.data?.error || "Something went wrong"); }
    };

    const commentHandler = async () => {
        if (!commentText.trim()) return toast.error("Reply cannot be empty");
        setSubmitting(true);
        try {
            await axios.post(`${POST_API_END_POINT}/${tweet._id}/comment`, { text: commentText }, { withCredentials: true });
            toast.success("Replied!");
            setCommentText(""); setSuggestions([]);
            toggleRefresh(); fetchTweet();
        } catch (e) { toast.error(e?.response?.data?.error || "Failed to reply"); }
        finally { setSubmitting(false); }
    };

    const deleteTweetHandler = () => {
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[220px]">
                <span className="text-sm font-semibold text-orbit-text">Delete this post?</span>
                <span className="text-xs text-orbit-muted">This can't be undone.</span>
                <div className="flex gap-2 justify-end">
                    <button onClick={() => toast.dismiss(t.id)}
                        className="text-xs border border-orbit-border hover:bg-orbit-surface px-3 py-1.5 rounded-full text-orbit-muted font-medium">
                        Cancel
                    </button>
                    <button onClick={async () => {
                        toast.dismiss(t.id);
                        try {
                            await axios.delete(`${POST_API_END_POINT}/delete-post/${tweet._id}`, { withCredentials: true });
                            toast.success("Post deleted"); toggleRefresh(); navigate(-1);
                        } catch (e) { toast.error(e?.response?.data?.error || "Delete failed"); }
                    }} className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full font-medium">
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 6000, position: 'top-center' });
    };

    const isLiked = tweet?.likes?.some(l => (l.userId?._id ?? l.userId)?.toString() === user?.userId);
    const isBookmarked = bookmarks.some(b => b._id === tweet?._id);
    const isOwnTweet = user?.userId === tweet?.author?._id?.toString();
    const authorName = tweet?.author?.firstName
        ? `${tweet.author.firstName} ${tweet.author.lastName || ''}`.trim()
        : tweet?.author?.username || "User";

    if (loading) return (
        <div className='flex flex-1'>
            <div className='flex-1 border-l border-r border-orbit-border min-h-screen bg-orbit-bg'>
                <div className='flex items-center gap-3 py-3 px-4 border-b border-orbit-border sticky top-0 bg-orbit-bg z-10'>
                    <button onClick={() => navigate(-1)} className='p-2 rounded-full hover:bg-orbit-surface'>
                        <IoMdArrowBack size={20} className="text-orbit-text" />
                    </button>
                    <h1 className='font-bold text-orbit-text text-[17px]'>Post</h1>
                </div>
                <div className='p-4 animate-pulse space-y-4'>
                    <div className='flex gap-3'>
                        <div className='w-12 h-12 rounded-full bg-orbit-surface' />
                        <div className='flex-1 space-y-2 pt-1'>
                            <div className='h-3 bg-orbit-surface rounded w-1/4' />
                            <div className='h-3 bg-orbit-surface rounded w-1/5' />
                        </div>
                    </div>
                    <div className='h-4 bg-orbit-surface rounded w-full' />
                    <div className='h-4 bg-orbit-surface rounded w-4/5' />
                </div>
            </div>
        </div>
    );

    if (!tweet) return (
        <div className='flex-1 border-l border-r border-orbit-border min-h-screen bg-orbit-bg flex items-center justify-center'>
            <p className='text-orbit-muted'>Post not found.</p>
        </div>
    );

    return (
        <div className='flex flex-1 min-h-screen'>

            {/* ── Main column ── */}
            <div className='flex-1 border-l border-r border-orbit-border bg-orbit-bg'>

                {/* Sticky header */}
                <div className='flex items-center gap-3 py-3 px-4 border-b border-orbit-border bg-orbit-bg/90 backdrop-blur sticky top-0 z-10'>
                    <button onClick={() => navigate(-1)} className='p-2 rounded-full hover:bg-orbit-surface transition-colors'>
                        <IoMdArrowBack size={20} className="text-orbit-text" />
                    </button>
                    <h1 className='font-bold text-orbit-text text-[17px]'>Post</h1>
                </div>

                {/* Post */}
                <div className='px-4 pt-4 border-b border-orbit-border'>
                    {/* Author */}
                    <div className='flex items-start justify-between mb-4'>
                        <Link to={`/profile/${tweet.author?._id}`} className='flex items-center gap-3 group'>
                            <div className='w-11 h-11 rounded-full bg-orbit-surface border border-orbit-border overflow-hidden flex items-center justify-center text-orbit-teal font-bold shrink-0'>
                                {tweet.author?.profileImageUrl
                                    ? <img src={tweet.author.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                                    : authorName[0]?.toUpperCase()}
                            </div>
                            <div>
                                <p className='font-bold text-[15px] text-orbit-text group-hover:underline leading-tight'>{authorName}</p>
                                <p className='text-orbit-muted text-[13px]'>@{tweet.author?.username}</p>
                            </div>
                        </Link>
                        {isOwnTweet && (
                            <button onClick={deleteTweetHandler}
                                className='p-2 rounded-full text-orbit-muted hover:text-red-400 hover:bg-red-400/10 transition-colors'>
                                <MdOutlineDeleteOutline size={18} />
                            </button>
                        )}
                    </div>

                    {/* Text — big on detail view */}
                    <p className='text-[20px] text-orbit-text leading-relaxed mb-4 whitespace-pre-wrap break-words'>
                        {tweet.text}
                    </p>

                    {/* Image */}
                    {tweet.image?.url && (
                        <div className='rounded-2xl overflow-hidden border border-orbit-border mb-4'>
                            <img src={tweet.image.url} alt="post" className='w-full object-cover max-h-[500px]' />
                        </div>
                    )}

                    {/* Timestamp */}
                    <p className='text-orbit-muted text-[14px] py-3 border-b border-orbit-border'>
                        {tweet.createdAt ? new Date(tweet.createdAt).toLocaleString(undefined, {
                            hour: 'numeric', minute: '2-digit',
                            month: 'short', day: 'numeric', year: 'numeric'
                        }) : ''}
                    </p>

                    {/* Stats */}
                    {(tweet.likes?.length > 0 || tweet.comments?.length > 0) && (
                        <div className='flex gap-5 py-3 border-b border-orbit-border text-[14px]'>
                            {tweet.comments?.length > 0 && (
                                <span>
                                    <span className='text-orbit-text font-bold'>{tweet.comments.length}</span>
                                    <span className='text-orbit-muted ml-1'>{tweet.comments.length === 1 ? 'Reply' : 'Replies'}</span>
                                </span>
                            )}
                            {tweet.likes?.length > 0 && (
                                <span>
                                    <span className='text-orbit-text font-bold'>{tweet.likes.length}</span>
                                    <span className='text-orbit-muted ml-1'>{tweet.likes.length === 1 ? 'Like' : 'Likes'}</span>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Action icons */}
                    <div className='flex items-center gap-1 py-1 border-b border-orbit-border -mx-1'>
                        <ActionBtn onClick={() => {}} active={false} activeColor="text-orbit-teal"
                            hoverBg="hover:bg-orbit-teal/10" icon={<FaRegComment size={20} />} />
                        <ActionBtn onClick={likeHandler} active={isLiked} activeColor="text-pink-400"
                            hoverBg="hover:bg-pink-400/10"
                            icon={isLiked ? <AiFillHeart size={22} className="text-pink-400" /> : <CiHeart size={22} />} />
                        <ActionBtn onClick={() => toggleBookmark(tweet)} active={isBookmarked}
                            activeColor="text-orbit-teal" hoverBg="hover:bg-orbit-teal/10"
                            icon={<CiBookmark size={22} />} />
                    </div>

                    {/* ── Reply composer ── */}
                    <div className='py-4 border-b border-orbit-border'>
                        {/* AI suggestions row */}
                        {loadingSuggestions ? (
                            <div className='flex items-center gap-2 mb-3'>
                                <BsStars size={13} className='text-orbit-teal animate-pulse' />
                                <span className='text-[12px] text-orbit-muted'>Getting AI reply ideas…</span>
                            </div>
                        ) : suggestions.length > 0 && (
                            <div className='mb-3'>
                                <div className='flex items-center gap-1.5 mb-2'>
                                    <BsStars size={12} className='text-orbit-teal' />
                                    <span className='text-[11px] text-orbit-muted font-semibold tracking-wide uppercase'>
                                        AI Suggestions
                                    </span>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {suggestions.map((s, i) => (
                                        <button key={i} onClick={() => setCommentText(s)}
                                            className='text-[12px] px-3 py-1.5 rounded-full border border-orbit-teal/30 text-orbit-teal bg-orbit-teal/5 hover:bg-orbit-teal/15 hover:border-orbit-teal/60 transition-all text-left'>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className='flex gap-3 items-center'>
                            <div className='w-9 h-9 rounded-full bg-orbit-surface border border-orbit-border overflow-hidden flex items-center justify-center text-orbit-teal font-semibold text-sm shrink-0'>
                                {user?.profileImageUrl
                                    ? <img src={user.profileImageUrl} alt="me" className='w-full h-full object-cover' />
                                    : (user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                            </div>
                            <input type="text" value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !submitting && commentHandler()}
                                placeholder="Post your reply"
                                className='flex-1 bg-transparent text-orbit-text text-[15px] outline-none placeholder:text-orbit-muted'
                            />
                            <button onClick={commentHandler}
                                disabled={!commentText.trim() || submitting}
                                className='px-5 py-2 bg-orbit-teal text-orbit-bg rounded-full text-[14px] font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0'>
                                {submitting ? "…" : "Reply"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Comments thread ── */}
                <div className='pb-16'>
                    {tweet.comments?.length > 0 ? tweet.comments.map((comment) => {
                        const cName = comment.userId?.firstName
                            ? `${comment.userId.firstName} ${comment.userId.lastName || ''}`.trim()
                            : comment.userId?.username || "User";
                        return (
                            <div key={comment._id}
                                className='flex gap-3 px-4 py-3 border-b border-orbit-border hover:bg-orbit-surface/30 transition-colors'>
                                <Link to={`/profile/${comment.userId?._id}`}
                                    className='w-10 h-10 rounded-full bg-orbit-surface border border-orbit-border overflow-hidden flex items-center justify-center text-orbit-teal font-semibold text-sm shrink-0'>
                                    {comment.userId?.profileImageUrl
                                        ? <img src={comment.userId.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                                        : (comment.userId?.firstName?.[0] || 'U').toUpperCase()}
                                </Link>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-baseline gap-1.5 flex-wrap'>
                                        <Link to={`/profile/${comment.userId?._id}`}
                                            className='font-bold text-[14px] text-orbit-text hover:underline'>
                                            {cName}
                                        </Link>
                                        <span className='text-orbit-muted text-[13px]'>
                                            @{comment.userId?.username} · {timeSince(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className='text-[13px] text-orbit-teal mt-0.5'>
                                        Replying to @{tweet.author?.username}
                                    </p>
                                    <p className='text-[14px] text-orbit-text mt-1 leading-relaxed'>{comment.text}</p>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className='py-16 text-center'>
                            <p className='text-orbit-text font-bold text-lg mb-1'>No replies yet</p>
                            <p className='text-orbit-muted text-sm'>Be the first to reply!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ActionBtn = ({ onClick, active, activeColor, hoverBg, icon }) => (
    <button onClick={onClick}
        className={`p-2.5 rounded-full transition-colors text-orbit-muted ${hoverBg} ${active ? activeColor : ''}`}>
        {icon}
    </button>
);

export default TweetDetails;