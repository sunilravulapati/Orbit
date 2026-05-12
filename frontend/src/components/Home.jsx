import React, { useEffect } from 'react'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import MobileNav from './MobileNav'
import { Outlet, useNavigate } from "react-router-dom";
import useOtherUsers from '../hooks/useOtherUsers';
import useUserStore from '../store/useUserStore';
import useGetMyTweets from '../hooks/useGetMyTweets';
import useSocket from '../hooks/useSocket';

const Home = () => {
    useSocket();
    const user = useUserStore((state) => state.user);
    const otherUsers = useUserStore((state) => state.otherUsers);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useOtherUsers();
    useGetMyTweets();

    return (
        <div className='flex justify-center w-full max-w-7xl mx-auto min-h-screen relative'>
            <LeftSidebar />
            <div className='w-full sm:flex-1 lg:max-w-2xl border-x border-orbit-border min-h-screen pb-16 sm:pb-0'>
                <Outlet />
            </div>
            <RightSidebar otherUsers={otherUsers} />
            <MobileNav />
        </div>
    )
}

export default Home;