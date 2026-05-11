import React from 'react';
import { CiHome, CiHashtag, CiUser, CiBookmark } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import useTweetStore from '../store/useTweetStore';
import axios from "axios";
import { COMMON_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import logo from '../assets/logodesign2.png';
import useNotificationStore from '../store/useNotificationStore';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const unreadCount = useNotificationStore((s) => s.unreadCount);
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const setOtherUsers = useUserStore((state) => state.setOtherUsers);
    const setProfile = useUserStore((state) => state.setProfile);
    const openComposer = useTweetStore((state) => state.openComposer);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`${COMMON_API_END_POINT}/logout`, {}, { withCredentials: true });
            setUser(null);
            setOtherUsers(null);
            setProfile(null);
            navigate('/login');
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNewPost = () => {
        openComposer();
        navigate('/');
    };

    const navItems = [
        { path: '/', icon: <CiHome size={20} />, label: 'Home' },
        { path: '/explore', icon: <CiHashtag size={20} />, label: 'Explore' },
        {
            path: '/notifications', label: 'Notifications',
            icon: (
                <div className='relative'>
                    <IoIosNotificationsOutline size={20} />
                    {unreadCount > 0 && (
                        <span className='absolute -top-1.5 -right-1.5 bg-orbit-teal text-white text-[9px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold px-0.5'>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            )
        },
        { path: `/profile/${user?.userId}`, icon: <CiUser size={20} />, label: 'Profile', matchPath: '/profile' },
        { path: '/bookmarks', icon: <CiBookmark size={20} />, label: 'Bookmarks' },
    ];

    const displayName = user?.firstName
        ? `${user.firstName} ${user.lastName || ''}`.trim()
        : user?.username || 'User';
    const avatarLetter = displayName[0]?.toUpperCase() || 'U';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
                .ls-root { font-family: 'Sora', sans-serif; }

                .ls-nav-item {
                    position: relative;
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 14px; border-radius: 14px;
                    font-size: 14px; font-weight: 500;
                    transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
                    cursor: pointer; text-decoration: none;
                }
                .ls-nav-item:hover {
                    background: rgba(14,122,92,0.08);
                    color: #14b87e;
                    transform: translateX(3px);
                }
                .ls-nav-item.active {
                    background: rgba(14,122,92,0.12);
                    color: #14b87e;
                }
                .ls-nav-item.active::before {
                    content: '';
                    position: absolute; left: 0; top: 50%;
                    transform: translateY(-50%);
                    width: 3px; height: 60%;
                    background: linear-gradient(180deg, #0e7a5c, #14b87e);
                    border-radius: 0 3px 3px 0;
                }
                .ls-nav-item .ls-icon {
                    width: 36px; height: 36px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.18s ease;
                    flex-shrink: 0;
                }
                .ls-nav-item.active .ls-icon {
                    background: rgba(14,122,92,0.15);
                }
                .ls-nav-item:hover .ls-icon {
                    background: rgba(14,122,92,0.1);
                }

                .ls-logout {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 14px; border-radius: 14px;
                    font-size: 14px; font-weight: 500;
                    color: var(--orbit-muted, #6e767d);
                    cursor: pointer;
                    transition: background 0.18s ease, color 0.18s ease;
                }
                .ls-logout:hover {
                    background: rgba(248,113,113,0.08);
                    color: #f87171;
                }
                .ls-logout .ls-icon {
                    width: 36px; height: 36px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.18s ease;
                    flex-shrink: 0;
                }
                .ls-logout:hover .ls-icon {
                    background: rgba(248,113,113,0.1);
                }

                .ls-post-btn {
                    position: relative; overflow: hidden;
                    width: 100%; display: flex; align-items: center;
                    justify-content: center; gap: 8px;
                    padding: 11px 16px; border-radius: 14px;
                    font-size: 14px; font-weight: 700;
                    color: white; border: none; cursor: pointer;
                    background: linear-gradient(135deg, #0e7a5c 0%, #14b87e 100%);
                    box-shadow: 0 4px 16px rgba(14,122,92,0.3);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    font-family: 'Sora', sans-serif;
                    letter-spacing: 0.01em;
                }
                .ls-post-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(14,122,92,0.4);
                }
                .ls-post-btn:active { transform: translateY(0); }
                .ls-post-btn::after {
                    content: '';
                    position: absolute; inset: 0;
                    background: rgba(255,255,255,0.1);
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }
                .ls-post-btn:hover::after { transform: translateX(0); }

                .ls-user-card {
                    display: flex; align-items: center; gap: 10px;
                    padding: 10px 12px; border-radius: 14px;
                    cursor: pointer;
                    transition: background 0.18s ease;
                    text-decoration: none;
                }
                .ls-user-card:hover { background: rgba(255,255,255,0.04); }

                @keyframes ls-fade-in {
                    from { opacity: 0; transform: translateX(-12px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .ls-nav-item { animation: ls-fade-in 0.35s ease forwards; opacity: 0; }
                .ls-nav-item:nth-child(1) { animation-delay: 0.05s; }
                .ls-nav-item:nth-child(2) { animation-delay: 0.10s; }
                .ls-nav-item:nth-child(3) { animation-delay: 0.15s; }
                .ls-nav-item:nth-child(4) { animation-delay: 0.20s; }
                .ls-nav-item:nth-child(5) { animation-delay: 0.25s; }

                .ls-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(14,122,92,0.2), transparent);
                    margin: 8px 4px;
                }

                .ls-section-label {
                    font-size: 10px; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    color: rgba(110,118,125,0.6);
                    padding: 0 14px; margin-bottom: 4px;
                }
            `}</style>

            <div className='ls-root w-[20%] border-r border-orbit-border h-screen sticky top-0 px-3 py-5 flex flex-col bg-orbit-bg'>

                {/* Logo */}
                <div className='px-3 mb-6'>
                    <img className='w-28 rounded-full' src={logo} alt="Orbit" />
                </div>

                {/* Nav */}
                <nav className='flex flex-col gap-1 flex-1'>
                    {navItems.map((item) => {
                        const active = isActive(item.matchPath || item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`ls-nav-item ${active ? 'active' : 'text-orbit-muted'}`}
                            >
                                <span className='ls-icon'>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div className='ls-divider mt-2 mb-1' />

                    <div className='ls-section-label'>Account</div>

                    <div className='ls-logout' onClick={logoutHandler}>
                        <span className='ls-icon'><AiOutlineLogout size={18} /></span>
                        <span>Logout</span>
                    </div>
                </nav>

                {/* User card at bottom */}
                <div className='mt-4'>
                    <Link to={`/profile/${user?.userId}`} className='ls-user-card block mb-3'>
                        <div className='w-8 h-8 rounded-full bg-orbit-surface border border-orbit-border flex items-center justify-center text-orbit-teal font-bold text-sm overflow-hidden shrink-0'>
                            {user?.profileImageUrl
                                ? <img src={user.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                                : <span style={{ fontFamily: 'Sora, sans-serif' }}>{avatarLetter}</span>
                            }
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-orbit-text text-[12px] font-semibold truncate leading-tight'>{displayName}</p>
                            <p className='text-orbit-muted text-[11px] truncate'>@{user?.username || 'you'}</p>
                        </div>
                    </Link>

                    <button
                        type='button'
                        onClick={handleNewPost}
                        className='ls-post-btn'
                    >
                        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
                        New Post
                    </button>
                </div>
            </div>
        </>
    );
};

export default LeftSidebar;