import React, { useState, useEffect, useRef } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Link, useParams } from 'react-router-dom';
import useGetProfile from '../hooks/useGetProfile';
import axios from "axios";
import { USER_API_END_POINT, POST_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import useUserStore from '../store/useUserStore';
import useTweetStore from '../store/useTweetStore';
import Tweet from './Tweet';
import TweetSkeleton from './TweetSkeleton';

const TABS = ["Posts", "Replies", "Likes"];

/* ── tiny helpers ─────────────────────────────────────────── */
const AnimatedNumber = ({ value }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = value ?? 0;
        if (end === 0) { setDisplay(0); return; }
        const step = Math.ceil(end / 20);
        const timer = setInterval(() => {
            start = Math.min(start + step, end);
            setDisplay(start);
            if (start >= end) clearInterval(timer);
        }, 30);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{display}</span>;
};

/* ── component ────────────────────────────────────────────── */
const Profile = () => {
    const { id } = useParams();
    useGetProfile(id);

    const user        = useUserStore((s) => s.user);
    const profile     = useUserStore((s) => s.profile);
    const followingUpdate = useUserStore((s) => s.followingUpdate);
    const toggleRefresh   = useTweetStore((s) => s.toggleRefresh);
    const refresh         = useTweetStore((s) => s.refresh);

    const [activeTab, setActiveTab]   = useState("Posts");
    const [posts, setPosts]           = useState([]);
    const [loading, setLoading]       = useState(false);
    const [headerVisible, setHeaderVisible] = useState(false);
    const [btnHover, setBtnHover]     = useState(false);
    const [mounted, setMounted]       = useState(false);
    const bannerRef = useRef(null);

    /* mount animation */
    useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

    /* sticky header reveal */
    useEffect(() => {
        const onScroll = () => setHeaderVisible(window.scrollY > 110);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* fetch posts */
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setPosts([]);
            try {
                if (activeTab === "Posts") {
                    const res  = await axios.get(`${POST_API_END_POINT}/user/${id}`, { withCredentials: true });
                    const data = res.data?.payload ?? res.data?.data ?? res.data ?? [];
                    setPosts(Array.isArray(data) ? data : []);
                } else if (activeTab === "Likes") {
                    const res = await axios.get(`${POST_API_END_POINT}/all`, { withCredentials: true });
                    const all = res.data?.payload ?? res.data?.data ?? res.data ?? [];
                    setPosts((Array.isArray(all) ? all : []).filter(p =>
                        p?.likes?.some(l => (l.userId?._id ?? l.userId)?.toString() === id)
                    ));
                } else if (activeTab === "Replies") {
                    const res = await axios.get(`${POST_API_END_POINT}/all`, { withCredentials: true });
                    const all = res.data?.payload ?? res.data?.data ?? res.data ?? [];
                    setPosts((Array.isArray(all) ? all : []).filter(p =>
                        p?.comments?.some(c =>
                            c.userId === id || c.userId?._id === id || c.userId?._id?.toString() === id
                        )
                    ));
                }
            } catch (err) {
                if (err?.response?.status !== 404) toast.error("Failed to load posts");
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPosts();
    }, [id, activeTab, refresh]);

    const followAndUnfollowHandler = async () => {
        const following = profile?.followers?.some(
            f => (f.userId?._id ?? f.userId)?.toString() === user?.userId
        );
        try {
            if (following) {
                const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, {}, { withCredentials: true });
                toast.success(res.data.message || "Unfollowed");
            } else {
                const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, {}, { withCredentials: true });
                toast.success(res.data.message || "Followed");
            }
            followingUpdate(id);
            toggleRefresh();
        } catch (err) {
            toast.error(err?.response?.data?.error || "Something went wrong");
        }
    };

    const isFollowing    = profile?.followers?.some(f => (f.userId?._id ?? f.userId)?.toString() === user?.userId);
    const isOwnProfile   = profile?._id?.toString() === user?.userId?.toString();
    const profileName    = profile?.firstName
        ? `${profile.firstName} ${profile.lastName || ''}`.trim()
        : profile?.username || "User";
    const visibleTabs    = isOwnProfile ? TABS : ["Posts"];
    const joinDate       = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
        : '—';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

                .profile-root { font-family: 'Sora', sans-serif; }

                /* mount fade-slide */
                .prof-fade {
                    opacity: 0; transform: translateY(16px);
                    transition: opacity 0.5s ease, transform 0.5s ease;
                }
                .prof-fade.visible { opacity: 1; transform: translateY(0); }

                /* banner parallax shimmer */
                .banner-wrap { position: relative; overflow: hidden; }
                .banner-shimmer {
                    position: absolute; inset: 0;
                    background: linear-gradient(110deg,
                        transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%);
                    background-size: 200% 100%;
                    animation: shimmer 3.5s ease-in-out infinite;
                }
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

                /* avatar ring pulse */
                .avatar-ring {
                    position: absolute; inset: -6px; border-radius: 50%;
                    border: 2px solid rgba(14,122,92,0.5);
                    animation: pulse-ring 2.5s ease-in-out infinite;
                }
                @keyframes pulse-ring {
                    0%,100% { transform: scale(1); opacity: 0.5; }
                    50%      { transform: scale(1.08); opacity: 1; }
                }

                /* sticky header slide-down */
                .sticky-header {
                    transform: translateY(-100%);
                    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
                }
                .sticky-header.show { transform: translateY(0); }

                /* tab ink */
                .tab-ink {
                    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, #0e7a5c, #14b87e);
                    border-radius: 3px 3px 0 0;
                    transform: scaleX(0);
                    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
                }
                .tab-btn.active .tab-ink { transform: scaleX(1); }

                /* follow btn */
                .follow-btn {
                    position: relative; overflow: hidden;
                    transition: all 0.2s ease;
                }
                .follow-btn::after {
                    content: '';
                    position: absolute; inset: 0;
                    background: rgba(255,255,255,0.1);
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }
                .follow-btn:hover::after { transform: translateX(0); }

                /* stat card */
                .stat-card {
                    padding: 10px 14px; border-radius: 12px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    transition: background 0.2s, border-color 0.2s, transform 0.2s;
                    cursor: default;
                }
                .stat-card:hover {
                    background: rgba(14,122,92,0.08);
                    border-color: rgba(14,122,92,0.3);
                    transform: translateY(-2px);
                }

                /* empty state */
                .empty-orbit {
                    position: relative;
                    width: 90px; height: 90px;
                    margin: 0 auto 20px;
                }
                .orbit-ring-1, .orbit-ring-2 {
                    position: absolute; inset: 0; border-radius: 50%;
                    border: 1.5px solid rgba(14,122,92,0.3);
                    animation: spin-slow 8s linear infinite;
                }
                .orbit-ring-2 {
                    inset: 12px;
                    border-style: dashed;
                    border-color: rgba(14,122,92,0.2);
                    animation-duration: 5s;
                    animation-direction: reverse;
                }
                .orbit-dot {
                    position: absolute; top: -5px; left: 50%; transform: translateX(-50%);
                    width: 10px; height: 10px; border-radius: 50%;
                    background: #0e7a5c;
                    box-shadow: 0 0 12px rgba(14,122,92,0.8);
                }
                @keyframes spin-slow { to { transform: rotate(360deg); } }

                /* tweet feed stagger */
                .tweet-enter {
                    animation: tweet-in 0.35s ease forwards;
                    opacity: 0;
                }
                @keyframes tweet-in {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="profile-root w-full min-h-screen bg-orbit-bg">

                {/* ── Sticky header ───────────────────────────────────── */}
                <div className={`sticky-header ${headerVisible ? 'show' : ''} flex items-center gap-3 py-3 px-4 border-b border-orbit-border bg-orbit-bg/95 backdrop-blur sticky top-0 z-20`}>
                    <Link to="/" className="p-2 rounded-full hover:bg-orbit-surface transition-colors">
                        <IoMdArrowBack size={20} className="text-orbit-text" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-bold text-[15px] text-orbit-text leading-tight truncate">{profileName}</h1>
                        <p className="text-orbit-muted text-xs">
                            {!loading && posts.length > 0
                                ? `${posts.length} post${posts.length !== 1 ? 's' : ''}`
                                : 'Posts'}
                        </p>
                    </div>
                </div>

                {/* ── Banner ──────────────────────────────────────────── */}
                <div
                    ref={bannerRef}
                    className="banner-wrap h-40 w-full"
                    style={{
                        background: 'linear-gradient(135deg, #062e20 0%, #0e7a5c 30%, #1a3a5c 70%, #0d1b2a 100%)',
                    }}
                >
                    <div className="banner-shimmer" />
                    {/* subtle grid overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.02) 28px, rgba(255,255,255,0.02) 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.02) 28px, rgba(255,255,255,0.02) 29px)',
                    }} />
                </div>

                {/* ── Avatar + Action ─────────────────────────────────── */}
                <div className={`prof-fade ${mounted ? 'visible' : ''} flex items-end justify-between px-5 -mt-11 mb-5`}
                    style={{ transitionDelay: '0.05s' }}>

                    <div className="relative">
                        <div className="avatar-ring" />
                        <div className="w-22 h-22 rounded-full bg-orbit-surface border-[3px] border-orbit-bg flex items-center justify-center text-orbit-teal font-bold text-2xl overflow-hidden shadow-xl"
                            style={{ boxShadow: '0 0 0 3px #0e7a5c22, 0 8px 32px rgba(0,0,0,0.5)' }}>
                            {profile?.profileImageUrl
                                ? <img src={profile.profileImageUrl} alt="avatar" className="w-full h-full object-cover" />
                                : <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 28 }}>
                                    {profileName[0]?.toUpperCase() || "U"}
                                  </span>
                            }
                        </div>
                    </div>

                    {isOwnProfile ? (
                        <Link to="/edit-profile">
                            <button className="follow-btn px-5 py-2 rounded-full border border-orbit-border text-orbit-text font-semibold text-sm"
                                style={{ letterSpacing: '0.01em' }}>
                                Edit profile
                            </button>
                        </Link>
                    ) : (
                        <button
                            onClick={followAndUnfollowHandler}
                            onMouseEnter={() => setBtnHover(true)}
                            onMouseLeave={() => setBtnHover(false)}
                            className={`follow-btn px-6 py-2 rounded-full font-bold text-sm ${
                                isFollowing
                                    ? 'border border-orbit-border text-orbit-text'
                                    : 'text-white'
                            }`}
                            style={!isFollowing ? {
                                background: 'linear-gradient(135deg, #0e7a5c, #14b87e)',
                                boxShadow: '0 4px 16px rgba(14,122,92,0.4)',
                            } : isFollowing && btnHover ? {
                                borderColor: '#f87171',
                                color: '#f87171',
                                background: 'rgba(248,113,113,0.07)',
                            } : {}}
                        >
                            {isFollowing ? (btnHover ? "Unfollow" : "Following") : "Follow"}
                        </button>
                    )}
                </div>

                {/* ── User info ────────────────────────────────────────── */}
                <div className={`prof-fade ${mounted ? 'visible' : ''} px-5 pb-4`}
                    style={{ transitionDelay: '0.12s' }}>
                    <h1 className="font-bold text-[20px] text-orbit-text leading-tight tracking-tight"
                        style={{ fontFamily: 'Sora, sans-serif' }}>
                        {profileName}
                    </h1>
                    <p className="text-orbit-muted text-sm mt-0.5">@{profile?.username || "username"}</p>

                    {profile?.bio && (
                        <p className="mt-3 text-[14px] text-orbit-text leading-relaxed"
                            style={{ lineHeight: 1.65 }}>
                            {profile.bio}
                        </p>
                    )}

                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 mt-3 text-orbit-muted text-sm">
                        <span className="flex items-center gap-1.5">
                            <CiCalendar size={15} />
                            Joined {joinDate}
                        </span>
                        {profile?.location && (
                            <span className="flex items-center gap-1.5">
                                <HiOutlineLocationMarker size={14} />
                                {profile.location}
                            </span>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-3 mt-4">
                        <div className="stat-card">
                            <p className="text-orbit-text font-bold text-[15px]">
                                <AnimatedNumber value={profile?.following?.length ?? 0} />
                            </p>
                            <p className="text-orbit-muted text-xs mt-0.5">Following</p>
                        </div>
                        <div className="stat-card">
                            <p className="text-orbit-text font-bold text-[15px]">
                                <AnimatedNumber value={profile?.followers?.length ?? 0} />
                            </p>
                            <p className="text-orbit-muted text-xs mt-0.5">
                                {profile?.followers?.length === 1 ? 'Follower' : 'Followers'}
                            </p>
                        </div>
                        {posts.length > 0 && (
                            <div className="stat-card">
                                <p className="text-orbit-text font-bold text-[15px]">
                                    <AnimatedNumber value={posts.length} />
                                </p>
                                <p className="text-orbit-muted text-xs mt-0.5">Posts</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Tabs ─────────────────────────────────────────────── */}
                <div className={`prof-fade ${mounted ? 'visible' : ''} flex border-b border-orbit-border`}
                    style={{ transitionDelay: '0.2s' }}>
                    {visibleTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''} flex-1 py-3.5 text-sm font-semibold relative transition-colors hover:bg-orbit-surface/50 ${
                                activeTab === tab ? 'text-orbit-text' : 'text-orbit-muted'
                            }`}
                            style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                            {tab}
                            <span className="tab-ink" />
                        </button>
                    ))}
                </div>

                {/* ── Feed ─────────────────────────────────────────────── */}
                <div className="pb-20">
                    {loading ? (
                        <>{[0,1,2].map(i => <TweetSkeleton key={i} />)}</>
                    ) : posts.length > 0 ? (
                        posts.map((tweet, i) => (
                            <div key={tweet._id} className="tweet-enter"
                                style={{ animationDelay: `${i * 50}ms` }}>
                                <Tweet tweet={tweet} />
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                            <div className="empty-orbit">
                                <div className="orbit-ring-1">
                                    <div className="orbit-dot" />
                                </div>
                                <div className="orbit-ring-2" />
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    fontSize: 26
                                }}>
                                    {activeTab === 'Posts' ? '📝' : activeTab === 'Replies' ? '💬' : '🤍'}
                                </div>
                            </div>
                            <p className="text-orbit-text font-bold text-lg mb-1.5" style={{ fontFamily: 'Sora, sans-serif' }}>
                                {activeTab === 'Posts' && 'No posts yet'}
                                {activeTab === 'Replies' && 'No replies yet'}
                                {activeTab === 'Likes' && 'No liked posts yet'}
                            </p>
                            <p className="text-orbit-muted text-sm leading-relaxed max-w-60">
                                {activeTab === 'Posts' && "When you post, it'll show up here."}
                                {activeTab === 'Replies' && "Posts you've replied to will appear here."}
                                {activeTab === 'Likes' && 'Posts you like will show up here.'}
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export default Profile;