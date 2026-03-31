import React from 'react';
import { CiHome, CiHashtag, CiUser, CiBookmark } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import axios from "axios";
import { COMMON_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import logo from '../assets/logodesign2.png';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const setOtherUsers = useUserStore((state) => state.setOtherUsers);
    const setProfile = useUserStore((state) => state.setProfile);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const navClass = (path) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
            isActive(path)
                ? 'bg-orbit-card text-orbit-teal'
                : 'text-orbit-muted hover:bg-orbit-card hover:text-orbit-text'
        }`;

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`${COMMON_API_END_POINT}/logout`, {}, {
                withCredentials: true
            });
            setUser(null);
            setOtherUsers(null);
            setProfile(null);
            navigate('/login');
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        // ✅ sticky + h-screen keeps the sidebar fixed in the viewport
        // so mt-auto on the button always pushes it to the visible bottom
        <div className='w-[20%] border-r border-orbit-border h-screen sticky top-0 px-3 py-5 flex flex-col'>
            <div className='flex flex-col flex-1 overflow-hidden'>
                <div className='px-3 mb-4'>
                    <img className='w-30 rounded-full' src={logo} alt="orbit-logo" />
                </div>
                <div className='flex flex-col gap-1'>
                    <Link to="/" className={navClass('/')}>
                        <CiHome size="20px" />
                        <span className='font-medium text-sm'>Home</span>
                    </Link>
                    <Link to="/explore" className={navClass('/explore')}>
                        <CiHashtag size="20px" />
                        <span className='font-medium text-sm'>Explore</span>
                    </Link>
                    <Link to="/notifications" className={navClass('/notifications')}>
                        <IoIosNotificationsOutline size="20px" />
                        <span className='font-medium text-sm'>Notifications</span>
                    </Link>
                    <Link to={`/profile/${user?.userId}`} className={navClass('/profile')}>
                        <CiUser size="20px" />
                        <span className='font-medium text-sm'>Profile</span>
                    </Link>
                    <Link to="/bookmarks" className={navClass('/bookmarks')}>
                        <CiBookmark size="20px" />
                        <span className='font-medium text-sm'>Bookmarks</span>
                    </Link>
                    <div
                        onClick={logoutHandler}
                        className='flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-orbit-card text-orbit-muted hover:text-orbit-text transition-colors cursor-pointer'
                    >
                        <AiOutlineLogout size="20px" />
                        <span className='font-medium text-sm'>Logout</span>
                    </div>
                </div>
            </div>

            {/* ✅ Always visible at the bottom of the viewport */}
            <div className='px-2 pt-4'>
                <button className='w-full py-2 rounded-full text-sm font-semibold text-white bg-orbit-teal-dark hover:bg-orbit-teal hover:text-orbit-bg transition-colors'>
                    + New Post
                </button>
            </div>
        </div>
    );
};

export default LeftSidebar;