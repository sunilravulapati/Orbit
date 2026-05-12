import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import useUserStore from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const user = useUserStore((state) => state.user);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [usersList, setUsersList] = useState([]);
    const [postsList, setPostsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            toast.error("Unauthorized access");
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            fetchData();
        }
    }, [activeTab, user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const res = await axios.get(`${ADMIN_API_END_POINT}/users`, { withCredentials: true });
                setUsersList(res.data.payload || []);
            } else {
                const res = await axios.get(`${ADMIN_API_END_POINT}/posts`, { withCredentials: true });
                setPostsList(res.data.payload || []);
            }
        } catch (error) {
            console.error("Admin fetch error:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, isActive) => {
        try {
            if (isActive) {
                await axios.delete(`${ADMIN_API_END_POINT}/del-user/${userId}`, { withCredentials: true });
                toast.success("User blocked");
            } else {
                await axios.patch(`${ADMIN_API_END_POINT}/activate-user/${userId}`, {}, { withCredentials: true });
                toast.success("User unblocked");
            }
            fetchData();
        } catch (error) {
            toast.error("Failed to update user status");
        }
    };

    const togglePostStatus = async (postId, isActive) => {
        try {
            if (isActive) {
                await axios.delete(`${ADMIN_API_END_POINT}/del-post/${postId}`, { withCredentials: true });
                toast.success("Post hidden");
            } else {
                await axios.patch(`${ADMIN_API_END_POINT}/activate-post/${postId}`, {}, { withCredentials: true });
                toast.success("Post restored");
            }
            fetchData();
        } catch (error) {
            toast.error("Failed to update post status");
        }
    };

    if (!user || user.role !== 'ADMIN') return null;

    return (
        <div className="w-full h-screen overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-orbit-bg/80 backdrop-blur-md border-b border-orbit-border p-4">
                <h1 className="text-xl font-bold text-orbit-text">Admin Dashboard</h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-orbit-border">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 py-4 text-sm font-semibold transition duration-200 ${
                        activeTab === 'users' ? 'text-orbit-teal border-b-4 border-orbit-teal' : 'text-orbit-muted hover:bg-orbit-surface'
                    }`}
                >
                    Manage Users
                </button>
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`flex-1 py-4 text-sm font-semibold transition duration-200 ${
                        activeTab === 'posts' ? 'text-orbit-teal border-b-4 border-orbit-teal' : 'text-orbit-muted hover:bg-orbit-surface'
                    }`}
                >
                    Manage Posts
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {loading ? (
                    <div className="text-center text-orbit-muted mt-8">Loading...</div>
                ) : activeTab === 'users' ? (
                    <div className="flex flex-col gap-4">
                        {usersList.map((u) => (
                            <div key={u._id} className="bg-orbit-card p-4 rounded-xl border border-orbit-border-subtle flex items-center justify-between shadow-card hover:bg-orbit-card-hover transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-orbit-surface border border-orbit-border shrink-0 flex items-center justify-center text-orbit-teal font-bold">
                                        {u.profileImageUrl ? (
                                            <img src={u.profileImageUrl} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            (u.firstName?.[0] || 'U').toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-orbit-text font-bold">{u.firstName} {u.lastName}</h3>
                                        <p className="text-orbit-muted text-sm">@{u.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${u.isActive ? 'bg-orbit-teal-muted text-orbit-teal' : 'bg-red-500/10 text-red-500'}`}>
                                        {u.isActive ? 'Active' : 'Blocked'}
                                    </span>
                                    <button
                                        onClick={() => toggleUserStatus(u._id, u.isActive)}
                                        className={`px-4 py-2 text-sm font-bold rounded-full transition ${
                                            u.isActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-orbit-teal hover:bg-orbit-teal-light text-orbit-bg'
                                        }`}
                                    >
                                        {u.isActive ? 'Block' : 'Unblock'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {postsList.map((p) => (
                            <div key={p._id} className="bg-orbit-card p-4 rounded-xl border border-orbit-border-subtle flex flex-col gap-3 shadow-card hover:bg-orbit-card-hover transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-orbit-surface flex items-center justify-center text-orbit-teal font-bold shrink-0">
                                            {p.author?.profileImageUrl ? (
                                                <img src={p.author.profileImageUrl} alt="avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                (p.author?.firstName?.[0] || 'U').toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-orbit-text font-bold text-sm">{p.author?.firstName}</h3>
                                            <p className="text-orbit-muted text-xs">@{p.author?.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${p.isActive ? 'bg-orbit-teal-muted text-orbit-teal' : 'bg-red-500/10 text-red-500'}`}>
                                            {p.isActive ? 'Active' : 'Hidden'}
                                        </span>
                                        <button
                                            onClick={() => togglePostStatus(p._id, p.isActive)}
                                            className={`px-4 py-1.5 text-xs font-bold rounded-full transition ${
                                                p.isActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-orbit-teal hover:bg-orbit-teal-light text-orbit-bg'
                                            }`}
                                        >
                                            {p.isActive ? 'Hide' : 'Restore'}
                                        </button>
                                    </div>
                                </div>
                                <div className="text-orbit-text text-sm">
                                    {p.text}
                                </div>
                                {p.image?.url && (
                                    <div className="mt-2 rounded-xl overflow-hidden border border-orbit-border">
                                        <img src={p.image.url} alt="post content" className="w-full h-auto" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
