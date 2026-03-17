import React, { useEffect } from 'react'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import { Outlet, useNavigate } from "react-router-dom";
import useOtherUsers from '../hooks/useOtherUsers';
import useUserStore from '../store/useUserStore';
import useGetMyTweets from '../hooks/useGetMyTweets';

const Home = () => {
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
        <div className='flex justify-between w-[90%] mx-auto min-h-screen'>
            <LeftSidebar />
            <Outlet />
            <RightSidebar otherUsers={otherUsers} />
        </div>
    )
}

export default Home;