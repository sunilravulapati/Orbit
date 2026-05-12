import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Feed from './Feed';
import Profile from './Profile';
import Explore from './Explore';
import Notifications from './Notifications';
import Bookmarks from './BookMarks';
import EditProfile from './EditProfile';
import TweetDetails from './TweetDetails';
import Hero from './Hero';
import ErrorBoundary from './ErrorBoundary';
import AdminDashboard from './AdminDashboard';

const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path: "/landing",
            element: <Hero />,
            errorElement: <ErrorBoundary />
        },
        {
            path: "/",
            element: <Home />,
            errorElement: <ErrorBoundary />,
            children: [
                { path: "/",                element: <Feed /> },
                { path: "/profile/:id",     element: <Profile /> },
                { path: "/explore",         element: <Explore /> },
                { path: "/notifications",   element: <Notifications /> },
                { path: "/bookmarks",       element: <Bookmarks /> },
                { path: "/edit-profile",    element: <EditProfile /> },
                { path: "/tweet/:id",       element: <TweetDetails /> },
                { path: "/admin",           element: <AdminDashboard /> },
            ]
        },
        {
            path: "/login",
            element: <Login />,
            errorElement: <ErrorBoundary />
        },
        {
            path: "*",
            element: <ErrorBoundary />
        }
    ]);

    return (
        <div>
            <RouterProvider router={appRouter} />
        </div>
    );
};

export default Body;