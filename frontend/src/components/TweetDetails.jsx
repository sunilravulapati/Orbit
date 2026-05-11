import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { AiFillHeart, AiFillBookmark } from "react-icons/ai";
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

/* ── Right sidebar ── */
const DetailRightSidebar = ({ relevantAuthor, otherUsers }) => {
    const [search, setSearch] = useState("");
    const filtered = (otherUsers || []).filter(u =>
        u?.username?.toLowerCase().includes(search.toLowerCase()) ||
        u?.firstName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='w-75 shrink-0 px-4 py-4 sticky top-0 h-screen overflow-y-auto hidden xl:block'>
            {/* Search */}
            <div className='flex items-center gap-2 px-3.5 py-2.5 bg-orbit-surface/60 border border-orbit-border rounded-2xl mb-5 focus-within:border-orbit-teal focus-within:bg-orbit-surface transition-all duration-200'>
                <CiSearch size={15} className='text-orbit-muted shrink-0' />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder='Search people'
                    className='bg-transparent outline-none text-[13px] text-orbit-text placeholder:text-orbit-muted w-full'
                />
            </div>

            {/* Relevant people */}
            {relevantAuthor && (
                <div className='bg-orbit-surface/50 border border-orbit-border rounded-2xl p-4 mb-3 hover:border-orbit-border/80 transition-colors'>
                    <h2 className='font-bold text-[13px] text-orbit-text mb-3 flex items-center gap-2'>
                        <span className='w-1 h-4 rounded-full bg-orbit-teal inline-block' />
                        Relevant people
                    </h2>
                    <div className='flex items-center justify-between gap-3'>
                        <Link to={`/profile/${relevantAuthor._id}`} className='flex items-center gap-2.5 min-w-0'>
                            <div className='w-9 h-9 rounded-full bg-orbit-card border border-orbit-border overflow-hidden flex items-center justify-center text-orbit-teal font-bold text-xs shrink-0'>
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
                                <p className='text-orbit-muted text-[11px] truncate'>@{relevantAuthor.username}</p>
                                {relevantAuthor.bio && (
                                    <p className='text-orbit-muted text-[11px] mt-0.5 line-clamp-1'>{relevantAuthor.bio}</p>
                                )}
                            </div>
                        </Link>
                        <Link to={`/profile/${relevantAuthor._id}`} className='shrink-0'>
                            <button className='text-[11px] px-3 py-1.5 rounded-full bg-orbit-text/5 border border-orbit-border text-orbit-text hover:bg-orbit-surface font-semibold transition-all whitespace-nowrap'>
                                View
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Who to follow */}
            {filtered.length > 0 && (
                <div className='bg-orbit-surface/50 border border-orbit-border rounded-2xl p-4'>
                    <h2 className='font-bold text-[13px] text-orbit-text mb-3 flex items-center gap-2'>
                        <span className='w-1 h-4 rounded-full bg-orbit-teal inline-block' />
                        Who to follow
                    </h2>
                    <div className='flex flex-col'>
                        {filtered.slice(0, 5).map(u => (
                            <div key={u._id} className='flex items-center justify-between gap-3 py-2.5 border-b border-orbit-border/40 last:border-0 group'>
                                <Link to={`/profile/${u._id}`} className='flex items-center gap-2 min-w-0'>
                                    <div className='w-8 h-8 rounded-full bg-orbit-card border border-orbit-border overflow-hidden flex items-center justify-center text-orbit-teal text-xs font-bold shrink-0'>
                                        {u.profileImageUrl ? (
                                            <img src={u.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                                        ) : (
                                            (u.firstName?.[0] || u.username?.[0] || 'U').toUpperCase()
                                        )}
                                    </div>
                                    <div className='min-w-0'>
                                        <p className='font-semibold text-[12px] text-orbit-text truncate group-hover:text-orbit-teal transition-colors'>
                                            {u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : u.username}
                                        </p>
                                        <p className='text-orbit-muted text-[11px] truncate'>@{u.username}</p>
                                    </div>
                                </Link>
                                <Link to={`/profile/${u._id}`} className='shrink-0'>
                                    <button className='text-[11px] px-2.5 py-1 rounded-full border border-orbit-border text-orbit-text hover:bg-orbit-teal hover:text-orbit-bg hover:border-orbit-teal font-medium transition-all'>
                                        Follow
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

/* ── Main ── */
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
            <div className="flex flex-col gap-3 min-w-55">
                <span className="text-sm font-bold text-orbit-text">Delete this post?</span>
                <span className="text-xs text-orbit-muted">This action cannot be undone.</span>
                <div className="flex gap-2 justify-end">
                    <button onClick={() => toast.dismiss(t.id)}
                        className="text-xs border border-orbit-border hover:bg-orbit-surface px-3 py-1.5 rounded-full text-orbit-muted font-medium transition-colors">
                        Cancel
                    </button>
                    <button onClick={async () => {
                        toast.dismiss(t.id);
                        try {
                            await axios.delete(`${POST_API_END_POINT}/delete-post/${tweet._id}`, { withCredentials: true });
                            toast.success("Post deleted"); toggleRefresh(); navigate(-1);
                        } catch (e) { toast.error(e?.response?.data?.error || "Delete failed"); }
                    }} className="text-xs bg-red-500 hover:bg-red-600 active:scale-95 text-white px-3 py-1.5 rounded-full font-medium transition-all">
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

    /* ── Loading skeleton ── */
    if (loading) return (
        <div className='flex flex-1'>
            <div className='flex-1 border-l border-r border-orbit-border min-h-screen bg-orbit-bg'>
                <div className='flex items-center gap-3 py-3 px-4 border-b border-orbit-border sticky top-0 bg-orbit-bg/80 backdrop-blur-md z-10'>
                    <button onClick={() => navigate(-1)} className='p-2 rounded-full hover:bg-orbit-surface transition-colors'>
                        <IoMdArrowBack size={19} className="text-orbit-text" />
                    </button>
                    <h1 className='font-bold text-orbit-text text-[17px] tracking-tight'>Post</h1>
                </div>
                <div className='p-5 space-y-5'>
                    <div className='flex gap-3'>
                        <div className='w-12 h-12 rounded-full bg-orbit-surface shrink-0 animate-pulse' />
                        <div className='flex-1 space-y-2 pt-1'>
                            <div className='h-3 bg-orbit-surface rounded-full w-1/3 animate-pulse' />
                            <div className='h-2.5 bg-orbit-surface rounded-full w-1/4 animate-pulse' />
                        </div>
                    </div>
                    <div className='space-y-2.5'>
                        <div className='h-5 bg-orbit-surface rounded-full w-full animate-pulse' />
                        <div className='h-5 bg-orbit-surface rounded-full w-5/6 animate-pulse' />
                        <div className='h-5 bg-orbit-surface rounded-full w-3/4 animate-pulse' />
                    </div>
                    <div className='h-2.5 bg-orbit-surface rounded-full w-1/3 animate-pulse' />
                </div>
            </div>
        </div>
    );

    if (!tweet) return (
        <div className='flex flex-1'>
            <div className='flex-1 border-l border-r border-orbit-border min-h-screen bg-orbit-bg flex items-center justify-center'>
                <div className='text-center px-8'>
                    <p className='text-5xl mb-4 opacity-30'>🛸</p>
                    <p className='text-orbit-text font-bold text-lg mb-1 tracking-tight'>Post not found</p>
                    <p className='text-orbit-muted text-sm mb-5'>This post may have been deleted.</p>
                    <button onClick={() => navigate(-1)}
                        className='px-5 py-2 bg-orbit-teal text-orbit-bg rounded-full text-sm font-bold hover:opacity-90 active:scale-95 transition-all'>
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className='flex flex-1 min-h-screen'>
            {/* ── Main column ── */}
            <div className='flex-1 border-l border-r border-orbit-border bg-orbit-bg min-w-0'>

                {/* Sticky header */}
                <div className='flex items-center gap-3 py-3 px-4 border-b border-orbit-border bg-orbit-bg/80 backdrop-blur-md sticky top-0 z-10'>
                    <button
                        onClick={() => navigate(-1)}
                        className='p-2 rounded-full hover:bg-orbit-surface/70 transition-all duration-150 group'
                    >
                        <IoMdArrowBack size={19} className="text-orbit-muted group-hover:text-orbit-text transition-colors" />
                    </button>
                    <div>
                        <h1 className='font-bold text-orbit-text text-[17px] tracking-tight leading-tight'>Post</h1>
                        {tweet.comments?.length > 0 && (
                            <p className='text-[11px] text-orbit-muted leading-none'>
                                {tweet.comments.length} {tweet.comments.length === 1 ? 'reply' : 'replies'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Post card */}
                <div className='px-5 pt-5 border-b border-orbit-border'>

                    {/* Author row */}
                    <div className='flex items-start justify-between mb-4'>
                        <Link to={`/profile/${tweet.author?._id}`} className='flex items-center gap-3 group'>
                            <div className='w-11 h-11 rounded-full bg-orbit-surface border border-orbit-border overflow-hidden flex items-center justify-center text-orbit-teal font-bold text-base shrink-0 ring-2 ring-transparent group-hover:ring-orbit-teal/25 transition-all duration-200'>
                                {tweet.author?.profileImageUrl
                                    ? <img src={tweet.author.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                                    : authorName[0]?.toUpperCase()}
                            </div>
                            <div>
                                <p className='font-bold text-[15px] text-orbit-text group-hover:text-orbit-teal transition-colors leading-tight tracking-tight'>
                                    {authorName}
                                </p>
                                <p className='text-orbit-muted text-[13px]'>@{tweet.author?.username}</p>
                            </div>
                        </Link>
                        {isOwnTweet && (
                            <button
                                onClick={deleteTweetHandler}
                                className='p-2 rounded-full text-orbit-muted hover:text-red-400 hover:bg-red-400/8 active:scale-90 transition-all duration-150'
                                title="Delete post"
                            >
                                <MdOutlineDeleteOutline size={17} />
                            </button>
                        )}
                    </div>

                    {/* Post text — larger, editorial feel */}
                    <p className='text-[19px] text-orbit-text leading-[1.65] mb-4 whitespace-pre-wrap wrap-break-word font-normal tracking-[-0.015em]'>
                        {tweet.text}
                    </p>

                    {/* Image */}
                    {tweet.image?.url && (
                        <div className='rounded-2xl overflow-hidden border border-orbit-border mb-4'>
                            <img src={tweet.image.url} alt="post" className='w-full object-cover max-h-120' />
                        </div>
                    )}

                    {/* Timestamp */}
                    <p className='text-orbit-muted text-[12px] py-3 border-b border-orbit-border tracking-wide'>
                        {tweet.createdAt ? new Date(tweet.createdAt).toLocaleString(undefined, {
                            hour: 'numeric', minute: '2-digit',
                            month: 'short', day: 'numeric', year: 'numeric'
                        }) : ''}
                    </p>

                    {/* Stats row */}
                    {(tweet.likes?.length > 0 || tweet.comments?.length > 0) && (
                        <div className='flex gap-5 py-3 border-b border-orbit-border text-[14px]'>
                            {tweet.comments?.length > 0 && (
                                <span className='hover:underline cursor-pointer group'>
                                    <span className='text-orbit-text font-bold group-hover:text-orbit-teal transition-colors'>{tweet.comments.length}</span>
                                    <span className='text-orbit-muted ml-1.5'>{tweet.comments.length === 1 ? 'Reply' : 'Replies'}</span>
                                </span>
                            )}
                            {tweet.likes?.length > 0 && (
                                <span className='hover:underline cursor-pointer group'>
                                    <span className='text-orbit-text font-bold group-hover:text-pink-400 transition-colors'>{tweet.likes.length}</span>
                                    <span className='text-orbit-muted ml-1.5'>{tweet.likes.length === 1 ? 'Like' : 'Likes'}</span>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Action icons */}
                    <div className='flex items-center py-0.5 border-b border-orbit-border -mx-1'>
                        <ActionBtn
                            onClick={() => {}}
                            active={false}
                            activeColor="text-orbit-teal"
                            hoverBg="hover:bg-orbit-teal/8"
                            hoverColor="hover:text-orbit-teal"
                            icon={<FaRegComment size={17} />}
                            label={tweet.comments?.length > 0 ? tweet.comments.length : null}
                        />
                        <ActionBtn
                            onClick={likeHandler}
                            active={isLiked}
                            activeColor="text-pink-400"
                            hoverBg="hover:bg-pink-400/8"
                            hoverColor="hover:text-pink-400"
                            icon={isLiked
                                ? <AiFillHeart size={19} className="text-pink-400" />
                                : <CiHeart size={20} />}
                            label={tweet.likes?.length > 0 ? tweet.likes.length : null}
                        />
                        <ActionBtn
                            onClick={() => toggleBookmark(tweet)}
                            active={isBookmarked}
                            activeColor="text-orbit-teal"
                            hoverBg="hover:bg-orbit-teal/8"
                            hoverColor="hover:text-orbit-teal"
                            icon={isBookmarked
                                ? <AiFillBookmark size={19} className="text-orbit-teal" />
                                : <CiBookmark size={20} />}
                        />
                    </div>

                    {/* ── Reply composer ── */}
                    <div className='py-4 border-b border-orbit-border'>

                        {/* AI suggestions */}
                        {loadingSuggestions ? (
                            <div className='flex items-center gap-2 mb-3 px-1'>
                                <BsStars size={12} className='text-orbit-teal animate-pulse' />
                                <span className='text-[11px] text-orbit-muted'>Generating reply ideas…</span>
                                <div className='flex gap-1 ml-1'>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className='w-12 h-7 rounded-full bg-orbit-surface animate-pulse' style={{ animationDelay: `${i * 100}ms` }} />
                                    ))}
                                </div>
                            </div>
                        ) : suggestions.length > 0 && (
                            <div className='mb-4'>
                                <div className='flex items-center gap-1.5 mb-2.5 px-0.5'>
                                    <BsStars size={11} className='text-orbit-teal' />
                                    <span className='text-[10.5px] text-orbit-teal font-semibold tracking-widest uppercase'>
                                        AI suggestions
                                    </span>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCommentText(s)}
                                            className={`text-[12px] px-3.5 py-2 rounded-full border text-left leading-snug transition-all duration-150 active:scale-95
                                                ${commentText === s
                                                    ? 'border-orbit-teal bg-orbit-teal/15 text-orbit-teal font-medium'
                                                    : 'border-orbit-teal/25 text-orbit-teal bg-orbit-teal/5 hover:bg-orbit-teal/12 hover:border-orbit-teal/50'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input row */}
                        <div className='flex gap-3 items-center'>
                            <div className='w-9 h-9 rounded-full bg-orbit-surface border border-orbit-border overflow-hidden flex items-center justify-center text-orbit-teal font-semibold text-sm shrink-0'>
                                {user?.profileImageUrl
                                    ? <img src={user.profileImageUrl} alt="me" className='w-full h-full object-cover' />
                                    : (user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                            </div>
                            <div className='flex-1 relative'>
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !submitting && commentHandler()}
                                    placeholder="Post your reply"
                                    className='w-full bg-orbit-surface/50 border border-orbit-border rounded-2xl px-4 py-2.5 text-orbit-text text-[13.5px] outline-none focus:border-orbit-teal focus:bg-orbit-surface/80 placeholder:text-orbit-muted transition-all duration-200 pr-16'
                                    autoFocus
                                />
                                {commentText.length > 0 && (
                                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium ${commentText.length > 260 ? 'text-red-400' : 'text-orbit-muted'}`}>
                                        {280 - commentText.length}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={commentHandler}
                                disabled={!commentText.trim() || submitting}
                                className='px-4 py-2.5 bg-orbit-teal text-orbit-bg rounded-2xl text-[12.5px] font-bold hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed shrink-0 whitespace-nowrap'
                            >
                                {submitting ? "…" : "Reply"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Comments thread ── */}
                <div className='pb-16'>
                    {tweet.comments?.length > 0 ? tweet.comments.map((comment, idx) => {
                        const cName = comment.userId?.firstName
                            ? `${comment.userId.firstName} ${comment.userId.lastName || ''}`.trim()
                            : comment.userId?.username ?? comment.userId?.name ?? "User";
                        return (
                            <div
                                key={comment._id || idx}
                                className='flex gap-3 px-5 py-4 border-b border-orbit-border/60 hover:bg-orbit-surface/15 transition-colors duration-150 group'
                            >
                                {/* Avatar + thread line */}
                                <div className='flex flex-col items-center shrink-0'>
                                    <Link
                                        to={`/profile/${comment.userId?._id}`}
                                        className='w-9 h-9 rounded-full bg-orbit-surface border border-orbit-border overflow-hidden flex items-center justify-center text-orbit-teal font-semibold text-xs hover:ring-2 hover:ring-orbit-teal/20 transition-all duration-150'
                                    >
                                        {comment.userId?.profileImageUrl
                                            ? <img src={comment.userId.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                                            : (comment.userId?.firstName?.[0] || 'U').toUpperCase()}
                                    </Link>
                                    {/* Thread connector line */}
                                    {idx < tweet.comments.length - 1 && (
                                        <div className='w-px flex-1 mt-2 bg-orbit-border/40 min-h-4' />
                                    )}
                                </div>

                                <div className='flex-1 min-w-0 pt-0.5'>
                                    <div className='flex items-center gap-1.5 flex-wrap mb-0.5'>
                                        <Link
                                            to={`/profile/${comment.userId?._id}`}
                                            className='font-bold text-[13.5px] text-orbit-text hover:text-orbit-teal transition-colors tracking-tight'
                                        >
                                            {cName}
                                        </Link>
                                        <span className='text-orbit-muted text-[12px]'>
                                            @{comment.userId?.username}
                                        </span>
                                        <span className='text-orbit-muted/50 text-[11px]'>·</span>
                                        <span className='text-orbit-muted text-[12px]'>
                                            {timeSince(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className='text-[12px] text-orbit-muted mb-1.5'>
                                        Replying to{' '}
                                        <span className='text-orbit-teal hover:underline cursor-pointer'>
                                            @{tweet.author?.username}
                                        </span>
                                    </p>
                                    <p className='text-[14px] text-orbit-text leading-relaxed'>
                                        {comment.text}
                                    </p>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className='py-20 text-center px-8'>
                            <div className='text-4xl mb-4 opacity-25'>💬</div>
                            <p className='text-orbit-text font-bold text-base mb-1 tracking-tight'>No replies yet</p>
                            <p className='text-orbit-muted text-sm'>Be the first to share your thoughts.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ActionBtn = ({ onClick, active, activeColor, hoverBg, hoverColor = "", icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 p-2.5 rounded-full transition-all duration-150 active:scale-90 text-orbit-muted ${hoverBg} ${hoverColor} ${active ? activeColor : ''}`}
    >
        {icon}
        {label != null && (
            <span className='text-[12px] font-medium tabular-nums'>{label}</span>
        )}
    </button>
);

export default TweetDetails;