import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { BsStars } from "react-icons/bs";
import { Link } from 'react-router-dom';

const dummyUsers = [
    { _id: '1', name: 'Alex Nova', username: 'alexnova' },
    { _id: '2', name: 'Sara Patel', username: 'sarapatel' },
    { _id: '3', name: 'Mike Khan', username: 'mikekhan' },
];

const AVATAR_COLORS = [
    { bg: 'rgba(14,122,92,0.15)', color: '#14b87e' },
    { bg: 'rgba(14,122,92,0.1)',  color: '#0e7a5c' },
    { bg: 'rgba(20,184,126,0.12)', color: '#14b87e' },
];

const RightSidebar = ({ otherUsers }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [focused, setFocused] = useState(false);
    const users = otherUsers?.length ? otherUsers : dummyUsers;

    const filteredUsers = users.filter(user => {
        const fullText = [user?.username, user?.firstName, user?.lastName, user?.name]
            .filter(Boolean).join(' ').toLowerCase();
        return fullText.includes(searchTerm.toLowerCase());
    });

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
                .rs-root { font-family: 'Sora', sans-serif; }

                .rs-search-wrap {
                    display: flex; align-items: center; gap: 10px;
                    padding: 9px 14px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 14px;
                    transition: border-color 0.2s ease, background 0.2s ease;
                }
                .rs-search-wrap.focused {
                    border-color: rgba(14,122,92,0.5);
                    background: rgba(14,122,92,0.04);
                }
                .rs-search-input {
                    background: transparent; border: none; outline: none;
                    font-size: 13px; width: 100%; min-width: 0;
                    font-family: 'Sora', sans-serif;
                }

                .rs-card {
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.07);
                    background: rgba(255,255,255,0.02);
                    overflow: hidden;
                }

                .rs-card-header {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    padding: 14px 16px 10px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .rs-user-row {
                    display: flex; align-items: center;
                    justify-content: space-between; gap: 10px;
                    padding: 10px 16px;
                    transition: background 0.18s ease;
                    cursor: pointer;
                }
                .rs-user-row:hover { background: rgba(14,122,92,0.05); }
                .rs-user-row:not(:last-child) {
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                }

                .rs-avatar {
                    width: 36px; height: 36px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 13px; font-weight: 700; flex-shrink: 0;
                    overflow: hidden;
                    border: 1px solid rgba(14,122,92,0.2);
                }

                .rs-profile-btn {
                    font-size: 11px; font-weight: 600;
                    padding: 5px 12px; border-radius: 20px;
                    border: 1px solid rgba(14,122,92,0.4);
                    color: #14b87e;
                    background: transparent;
                    transition: background 0.18s ease, border-color 0.18s ease, transform 0.15s ease;
                    font-family: 'Sora', sans-serif;
                    white-space: nowrap; cursor: pointer;
                    text-decoration: none; display: inline-block;
                }
                .rs-profile-btn:hover {
                    background: rgba(14,122,92,0.12);
                    border-color: rgba(14,122,92,0.7);
                    transform: scale(1.04);
                }

                .rs-trending-tag {
                    display: flex; flex-direction: column; gap: 1px;
                    padding: 10px 16px;
                    transition: background 0.18s ease;
                    cursor: pointer;
                }
                .rs-trending-tag:hover { background: rgba(14,122,92,0.05); }
                .rs-trending-tag:not(:last-child) {
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                }

                .rs-tag-pill {
                    display: inline-block;
                    font-size: 10px; font-weight: 600;
                    padding: 2px 8px; border-radius: 6px;
                    background: rgba(14,122,92,0.12);
                    color: #14b87e;
                    letter-spacing: 0.04em;
                    margin-bottom: 2px;
                    width: fit-content;
                }

                @keyframes rs-slide-in {
                    from { opacity: 0; transform: translateX(10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .rs-user-row { animation: rs-slide-in 0.3s ease forwards; opacity: 0; }
                .rs-user-row:nth-child(1) { animation-delay: 0.05s; }
                .rs-user-row:nth-child(2) { animation-delay: 0.10s; }
                .rs-user-row:nth-child(3) { animation-delay: 0.15s; }
                .rs-user-row:nth-child(4) { animation-delay: 0.20s; }
                .rs-user-row:nth-child(5) { animation-delay: 0.25s; }

                .rs-empty {
                    padding: 20px 16px; text-align: center;
                    color: rgba(110,118,125,0.7); font-size: 12px;
                }
            `}</style>

            <div className='rs-root hidden lg:flex w-[30%] max-w-sm px-4 py-5 sticky top-0 h-screen overflow-y-auto flex-col gap-4'>

                {/* Search */}
                <div
                    className={`rs-search-wrap ${focused ? 'focused' : ''}`}
                >
                    <CiSearch
                        size={16}
                        style={{ color: focused ? '#14b87e' : 'rgba(110,118,125,0.7)', flexShrink: 0, transition: 'color 0.2s' }}
                    />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className='rs-search-input text-orbit-text placeholder:text-orbit-muted'
                        placeholder='Search users…'
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            style={{
                                background: 'rgba(110,118,125,0.2)', border: 'none',
                                borderRadius: '50%', width: 18, height: 18,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'rgba(110,118,125,0.8)',
                                fontSize: 11, flexShrink: 0,
                            }}
                        >✕</button>
                    )}
                </div>

                {/* Who to follow */}
                <div className='rs-card'>
                    <div className='rs-card-header'>
                        <div className='flex items-center gap-2'>
                            <BsStars size={13} className='text-orbit-teal' />
                            <span
                                className='text-orbit-text font-bold text-[13px]'
                                style={{ fontFamily: 'Sora, sans-serif' }}
                            >
                                Who to follow
                            </span>
                        </div>
                        {filteredUsers.length > 0 && (
                            <span className='text-orbit-muted text-[11px]'>
                                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, i) => {
                            const displayName = user?.firstName
                                ? `${user.firstName} ${user.lastName || ''}`.trim()
                                : user?.name || user?.username || 'User';
                            const initials = displayName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];

                            return (
                                <div key={user?._id} className='rs-user-row'>
                                    <div className='flex items-center gap-3 min-w-0'>
                                        <div
                                            className='rs-avatar'
                                            style={{ background: avatarColor.bg, color: avatarColor.color }}
                                        >
                                            {user?.profileImageUrl ? (
                                                <img
                                                    src={user.profileImageUrl}
                                                    alt={displayName}
                                                    className='w-full h-full object-cover'
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <span style={{ fontFamily: 'Sora, sans-serif' }}>{initials || 'U'}</span>
                                            )}
                                        </div>
                                        <div className='min-w-0'>
                                            <p className='text-orbit-text text-[13px] font-semibold truncate leading-tight'>
                                                {displayName}
                                            </p>
                                            <p className='text-orbit-muted text-[11px] truncate'>
                                                @{user?.username || 'unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <Link to={`/profile/${user?._id}`} onClick={(e) => e.stopPropagation()}>
                                        <button className='rs-profile-btn'>View</button>
                                    </Link>
                                </div>
                            );
                        })
                    ) : (
                        <div className='rs-empty'>
                            {searchTerm ? `No users matching "${searchTerm}"` : 'No suggestions yet'}
                        </div>
                    )}
                </div>

                {/* Trending topics */}
                <div className='rs-card'>
                    <div className='rs-card-header'>
                        <div className='flex items-center gap-2'>
                            <span
                                className='text-orbit-text font-bold text-[13px]'
                                style={{ fontFamily: 'Sora, sans-serif' }}
                            >
                                Trending
                            </span>
                        </div>
                    </div>
                    {[
                        { tag: 'Technology', topic: 'AI & machine learning', posts: '12.4K' },
                        { tag: 'Design', topic: 'UI trends 2025', posts: '8.1K' },
                        { tag: 'Science', topic: 'Space exploration news', posts: '5.7K' },
                    ].map((item, i) => (
                        <div key={i} className='rs-trending-tag'>
                            <span className='rs-tag-pill'>{item.tag}</span>
                            <p className='text-orbit-text text-[13px] font-semibold leading-tight'>{item.topic}</p>
                            <p className='text-orbit-muted text-[11px]'>{item.posts} posts</p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <p className='text-[10px] text-orbit-muted px-1 pb-4' style={{ opacity: 0.5 }}>
                    Orbit · Social · {new Date().getFullYear()}
                </p>
            </div>
        </>
    );
};

export default RightSidebar;