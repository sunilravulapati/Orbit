import React from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import useGetProfile from '../hooks/useGetProfile';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import useUserStore from '../store/useUserStore';
import useTweetStore from '../store/useTweetStore';

const Profile = () => {
    const { id } = useParams();
    useGetProfile(id);

    const user = useUserStore((state) => state.user);
    const profile = useUserStore((state) => state.profile);
    const followingUpdate = useUserStore((state) => state.followingUpdate);
    const toggleRefresh = useTweetStore((state) => state.toggleRefresh);

    const followAndUnfollowHandler = async () => {
        const isFollowing = user?.following?.some(f => f.userId === id);
        try {
            axios.defaults.withCredentials = true;
            if (isFollowing) {
                const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, {});
                toast.success(res.data.message);
            } else {
                const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, {});
                toast.success(res.data.message);
            }
            followingUpdate(id);
            toggleRefresh();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Something went wrong");
        }
    }

    const isFollowing = user?.following?.some(f => f.userId === id);
    const isOwnProfile = profile?._id === user?.userId;

    const profileName = profile?.firstName
        ? `${profile.firstName} ${profile.lastName || ''}`.trim()
        : profile?.username || "User";

    return (
        <div className='w-[50%] border-l border-r border-orbit-border min-h-screen'>

            {/* Header */}
            <div className='flex items-center py-2 px-3 border-b border-orbit-border bg-orbit-bg sticky top-0 z-10'>
                <Link to="/" className='p-2 rounded-full hover:bg-orbit-card cursor-pointer'>
                    <IoMdArrowBack size="24px" className='text-orbit-text' />
                </Link>
                <div className='ml-2'>
                    <h1 className='font-semibold text-orbit-text'>{profileName}</h1>
                    <p className='text-orbit-faint text-xs'>Posts</p>
                </div>
            </div>

            {/* Banner */}
            <div className='h-36 w-full' style={{ background: 'linear-gradient(135deg, #0e7a5c, #1e3a5f)' }} />

            {/* Avatar + button */}
            <div className='flex items-end justify-between px-4 -mt-10 mb-3'>
                <div className='w-20 h-20 rounded-full bg-orbit-card border-4 border-orbit-bg flex items-center justify-center text-orbit-teal font-semibold text-2xl overflow-hidden'>
                    {profile?.profileImageUrl ? (
                        <img src={profile.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                    ) : (
                        profileName[0]?.toUpperCase() || "U"
                    )}
                </div>
                <div>
                    {isOwnProfile ? (
                        <Link to="/edit-profile">
                            <button className='px-4 py-1 rounded-full border border-orbit-border text-orbit-text hover:bg-orbit-card font-medium text-sm transition-colors'>
                                Edit Profile
                            </button>
                        </Link>
                    ) : (
                        <button
                            onClick={followAndUnfollowHandler}
                            className='px-4 py-1 bg-orbit-teal-dark hover:bg-orbit-teal hover:text-orbit-bg text-white rounded-full font-medium text-sm transition-colors'
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </button>
                    )}
                </div>
            </div>

            {/* User info */}
            <div className='px-4 mt-2'>
                <h1 className='font-semibold text-lg text-orbit-text'>{profileName}</h1>
                <p className='text-orbit-faint text-sm'>@{profile?.username || "username"}</p>
                {profile?.bio && (
                    <p className='mt-2 text-sm text-orbit-muted leading-relaxed'>{profile.bio}</p>
                )}
                <div className='flex gap-4 mt-3 text-sm'>
                    <span className='text-orbit-text font-semibold'>
                        {profile?.following?.length || 0}
                        <span className='text-orbit-faint font-normal ml-1'>Following</span>
                    </span>
                    <span className='text-orbit-text font-semibold'>
                        {profile?.followers?.length || 0}
                        <span className='text-orbit-faint font-normal ml-1'>Followers</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Profile;