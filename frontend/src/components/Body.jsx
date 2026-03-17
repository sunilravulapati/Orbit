import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Feed from './Feed';
import Profile from './Profile';
import Explore from './Explore';
import Notifications from './Notifications';
import Bookmarks from './Bookmarks';
import EditProfile from './EditProfile';
import  TweetDetails  from './TweetDetails';

const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
            children: [
                {
                    path: "/",
                    element: <Feed />
                },
                {
                    path: "/profile/:id",
                    element: <Profile />
                },
                {
                    path: "/explore",
                    element: <Explore />
                },
                {
                    path: "/notifications",
                    element: <Notifications />
                },
                {
                    path: "/bookmarks",
                    element: <Bookmarks />
                },
                {
                    path: "/edit-profile",
                    element: <EditProfile />
                }
            ]
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "tweet/:id",
            element: <TweetDetails />
        }
    ])
    return (
        <div>
            <RouterProvider router={appRouter} />
        </div>
    )
}

export default Body;