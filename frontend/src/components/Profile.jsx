import React, { useState, useEffect } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
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

const Profile = () => {
    const { id } = useParams();
    useGetProfile(id);

    const user = useUserStore((state) => state.user);
    const profile = useUserStore((state) => state.profile);
    const followingUpdate = useUserStore((state) => state.followingUpdate);
    const toggleRefresh = useTweetStore((state) => state.toggleRefresh);
    const refresh = useTweetStore((state) => state.refresh);

    const [activeTab, setActiveTab] = useState("Posts");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setPosts([]);
            try {
                if (activeTab === "Posts") {
                    // ✅ Direct endpoint: GET /post-api/user/:id
                    const res = await axios.get(
                        `${POST_API_END_POINT}/user/${id}`,
                        { withCredentials: true }
                    );
                    const data = res.data?.payload ?? res.data?.data ?? res.data ?? [];
                    setPosts(Array.isArray(data) ? data : []);

                } else if (activeTab === "Likes") {
                    // No /liked/:id endpoint exists — fetch all posts and filter
                    // by whether the user's id appears in each post's likes array
                    const res = await axios.get(
                        `${POST_API_END_POINT}/all`,
                        { withCredentials: true }
                    );
                    const all = res.data?.payload ?? res.data?.data ?? res.data ?? [];
                    const liked = (Array.isArray(all) ? all : []).filter(post =>
                        post?.likes?.some(l => (l.userId?._id ?? l.userId)?.toString() === id)
                    );
                    setPosts(liked);

                } else if (activeTab === "Replies") {
                    // No /replied/:id endpoint exists — fetch all posts and keep
                    // only those that have a comment authored by this user
                    const res = await axios.get(
                        `${POST_API_END_POINT}/all`,
                        { withCredentials: true }
                    );
                    const all = res.data?.payload ?? res.data?.data ?? res.data ?? [];
                    const replied = (Array.isArray(all) ? all : []).filter(post =>
                        post?.comments?.some(c =>
                            c.userId === id ||
                            c.userId?._id === id ||
                            c.userId?._id?.toString() === id
                        )
                    );
                    setPosts(replied);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                if (error?.response?.status !== 404) {
                    toast.error("Failed to load posts");
                }
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPosts();
    }, [id, activeTab, refresh]);

    const followAndUnfollowHandler = async () => {
        const currentlyFollowing = profile?.followers?.some(
            f => (f.userId?._id ?? f.userId)?.toString() === user?.userId
        );
        try {
            if (currentlyFollowing) {
                const res = await axios.post(
                    `${USER_API_END_POINT}/unfollow/${id}`,
                    {},
                    { withCredentials: true }
                );
                toast.success(res.data.message || "Unfollowed");
            } else {
                const res = await axios.post(
                    `${USER_API_END_POINT}/follow/${id}`,
                    {},
                    { withCredentials: true }
                );
                toast.success(res.data.message || "Followed");
            }
            followingUpdate(id);
            toggleRefresh();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Something went wrong");
        }
    };

    const isFollowing = profile?.followers?.some(
        f => (f.userId?._id ?? f.userId)?.toString() === user?.userId
    );
    const isOwnProfile = profile?._id?.toString() === user?.userId?.toString();
    const profileName = profile?.firstName
        ? `${profile.firstName} ${profile.lastName || ''}`.trim()
        : profile?.username || "User";
    const visibleTabs = isOwnProfile ? TABS : ["Posts"];

    return (
        <div className='w-[50%] border-l border-r border-orbit-border min-h-screen bg-orbit-bg'>

            {/* Header */}
            <div className='flex items-center gap-3 py-3 px-4 border-b border-orbit-border bg-orbit-bg/90 backdrop-blur sticky top-0 z-10'>
                <Link to="/" className='p-2 rounded-full hover:bg-orbit-surface transition-colors'>
                    <IoMdArrowBack size={20} className='text-orbit-text' />
                </Link>
                <div>
                    <h1 className='font-bold text-[15px] text-orbit-text leading-tight'>{profileName}</h1>
                    <p className='text-orbit-muted text-xs'>
                        {!loading && posts.length > 0
                            ? `${posts.length} post${posts.length !== 1 ? 's' : ''}`
                            : 'Posts'}
                    </p>
                </div>
            </div>

            {/* Banner */}
            <div
                className='h-36 w-full'
                style={{ background: 'linear-gradient(135deg, #0e7a5c 0%, #1a3a5c 60%, #15202b 100%)' }}
            />

            {/* Avatar + Action */}
            <div className='flex items-end justify-between px-4 -mt-10 mb-4'>
                <div className='w-[82px] h-[82px] rounded-full bg-orbit-surface border-4 border-orbit-bg flex items-center justify-center text-orbit-teal font-bold text-2xl overflow-hidden shadow-lg'>
                    {profile?.profileImageUrl ? (
                        <img src={profile.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                    ) : (
                        profileName[0]?.toUpperCase() || "U"
                    )}
                </div>
                {isOwnProfile ? (
                    <Link to="/edit-profile">
                        <button className='px-5 py-1.5 rounded-full border border-orbit-border text-orbit-text hover:bg-orbit-surface font-bold text-sm transition-colors'>
                            Edit profile
                        </button>
                    </Link>
                ) : (
                    <button
                        onClick={followAndUnfollowHandler}
                        className={`px-5 py-1.5 rounded-full font-bold text-sm transition-all ${isFollowing
                            ? 'border border-orbit-border text-orbit-text hover:border-red-400 hover:text-red-400 hover:bg-red-400/10'
                            : 'bg-orbit-text text-orbit-bg hover:bg-orbit-text/90'
                            }`}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </button>
                )}
            </div>

            {/* User info */}
            <div className='px-4 pb-3'>
                <h1 className='font-bold text-[18px] text-orbit-text leading-tight'>{profileName}</h1>
                <p className='text-orbit-muted text-sm mt-0.5'>@{profile?.username || "username"}</p>
                {profile?.bio && (
                    <p className='mt-3 text-[14px] text-orbit-text leading-relaxed'>{profile.bio}</p>
                )}
                <div className='flex items-center gap-1.5 mt-3 text-orbit-muted text-sm'>
                    <CiCalendar size={16} />
                    <span>
                        Joined {profile?.createdAt
                            ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
                            : '—'}
                    </span>
                </div>
                <div className='flex gap-5 mt-3 text-sm'>
                    <span className='text-orbit-text font-bold'>
                        {profile?.following?.length ?? 0}
                        <span className='text-orbit-muted font-normal ml-1'>Following</span>
                    </span>
                    <span className='text-orbit-text font-bold'>
                        {profile?.followers?.length ?? 0}
                        <span className='text-orbit-muted font-normal ml-1'>
                            {profile?.followers?.length === 1 ? 'Follower' : 'Followers'}
                        </span>
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className='flex border-b border-orbit-border mt-1'>
                {visibleTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-medium relative transition-colors hover:bg-orbit-surface/50 ${activeTab === tab ? 'text-orbit-text' : 'text-orbit-muted'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-orbit-teal rounded-full' />
                        )}
                    </button>
                ))}
            </div>

            {/* Feed */}
            <div className='pb-16'>
                {loading ? (
                    <>
                        <TweetSkeleton />
                        <TweetSkeleton />
                        <TweetSkeleton />
                    </>
                ) : posts.length > 0 ? (
                    posts.map((tweet) => (
                        <Tweet key={tweet._id} tweet={tweet} />
                    ))
                ) : (
                    <div className='flex flex-col items-center justify-center py-16 px-8 text-center'>
                        <p className='text-orbit-text font-bold text-xl mb-1'>
                            {activeTab === 'Posts' && 'No posts yet'}
                            {activeTab === 'Replies' && 'No replies yet'}
                            {activeTab === 'Likes' && 'No liked posts yet'}
                        </p>
                        <p className='text-orbit-muted text-sm'>
                            {activeTab === 'Posts' && "When you post, it'll show up here."}
                            {activeTab === 'Replies' && "Posts you've replied to will appear here."}
                            {activeTab === 'Likes' && 'Posts you like will show up here.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;