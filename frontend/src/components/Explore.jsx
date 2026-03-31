import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { POST_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import TweetSkeleton from './TweetSkeleton';
import Tweet from './Tweet';
import useTweetStore from '../store/useTweetStore';

// Re-use the same refresh signal so likes/bookmarks update across pages
const Explore = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [posts, setPosts] = useState(null);
    const refresh = useTweetStore((state) => state.refresh);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get(`${POST_API_END_POINT}/all`, { withCredentials: true });
                const data = res.data?.payload ?? res.data?.data ?? res.data ?? [];
                setPosts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load posts");
                setPosts([]);
            }
        };
        fetchAllPosts();
    }, [refresh]); // re-fetch when likes/comments change

    const filteredPosts = posts?.filter(post =>
        post?.text?.toLowerCase().includes(search.toLowerCase()) ||
        post?.author?.username?.toLowerCase().includes(search.toLowerCase()) ||
        post?.author?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        post?.author?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='w-[50%] border-l border-r border-orbit-border min-h-screen bg-orbit-bg'>

            {/* Search header — sticky */}
            <div className='py-3 px-4 border-b border-orbit-border bg-orbit-bg/90 backdrop-blur sticky top-0 z-10'>
                <div className='flex items-center gap-2 px-4 py-2.5 bg-orbit-surface border border-orbit-border rounded-full focus-within:border-orbit-teal transition-colors'>
                    <CiSearch size={18} className='text-orbit-muted shrink-0' />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='bg-transparent outline-none text-[14px] text-orbit-text placeholder:text-orbit-muted w-full'
                        placeholder='Search posts or people'
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className='text-orbit-muted hover:text-orbit-text text-xs shrink-0'
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Results label when searching */}
            {search.trim() && (
                <div className='px-4 py-2 border-b border-orbit-border'>
                    <p className='text-orbit-muted text-xs'>
                        {filteredPosts?.length
                            ? `${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''} for "${search}"`
                            : `No results for "${search}"`}
                    </p>
                </div>
            )}

            {/* Posts */}
            {posts === null ? (
                [...Array(5)].map((_, i) => <TweetSkeleton key={i} />)
            ) : filteredPosts?.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-24 px-8 text-center'>
                    <div className='text-4xl mb-4'>🔭</div>
                    <h2 className='text-orbit-text font-bold text-xl mb-2'>Nothing found</h2>
                    <p className='text-orbit-muted text-sm'>Try a different search term.</p>
                </div>
            ) : (
                // ✅ Reuse Tweet component — gets correct author resolution,
                //    like/comment/bookmark/delete logic, and click-to-detail nav for free
                filteredPosts.map((post) => (
                    <Tweet key={post._id} tweet={post} />
                ))
            )}
        </div>
    );
};

export default Explore;