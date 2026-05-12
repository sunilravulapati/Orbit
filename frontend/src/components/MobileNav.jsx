import React from 'react';
import { CiHome, CiSearch, CiUser } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useLocation } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import useNotificationStore from '../store/useNotificationStore';

const MobileNav = () => {
    const location = useLocation();
    const user = useUserStore((state) => state.user);
    const unreadCount = useNotificationStore((s) => s.unreadCount);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: '/', icon: <CiHome size={26} />, label: 'Home' },
        { path: '/explore', icon: <CiSearch size={26} />, label: 'Explore' },
        {
            path: '/notifications', label: 'Notifications',
            icon: (
                <div className='relative'>
                    <IoIosNotificationsOutline size={26} />
                    {unreadCount > 0 && (
                        <span className='absolute -top-1.5 -right-1.5 bg-orbit-teal text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold px-0.5'>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            )
        },
        { path: `/profile/${user?.userId}`, icon: <CiUser size={26} />, label: 'Profile', matchPath: '/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-orbit-bg/90 backdrop-blur-md border-t border-orbit-border z-50 sm:hidden pb-safe">
            <nav className="flex justify-around items-center h-14">
                {navItems.map((item) => {
                    const active = isActive(item.matchPath || item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full transition duration-200 ${
                                active ? 'text-orbit-teal' : 'text-orbit-muted hover:text-orbit-text'
                            }`}
                        >
                            {item.icon}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileNav;
