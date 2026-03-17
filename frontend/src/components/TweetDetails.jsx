import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import axios from 'axios';
import { POST_API_END_POINT, timeSince } from '../utils/constant';
import TweetSkeleton from './TweetSkeleton';

const TweetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tweet, setTweet] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`${POST_API_END_POINT}/post/${id}`, { withCredentials: true });
                setTweet(res.data.payload);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDetails();
    }, [id]);

    if (!tweet) return <div className="p-8"><TweetSkeleton /></div>;

    return (
        <div className='w-full max-w-2xl mx-auto border-l border-r border-orbit-border min-h-screen bg-orbit-bg'>
            <div className='flex items-center p-3 border-b border-orbit-border bg-orbit-bg sticky top-0 z-10'>
                <button onClick={() => navigate(-1)} className='p-2 rounded-full hover:bg-orbit-card transition-colors'>
                    <IoMdArrowBack size="20px" className="text-orbit-text" />
                </button>
                <h1 className='ml-4 font-bold text-orbit-text text-lg'>Post</h1>
            </div>

            <div className='p-4 border-b border-orbit-border'>
                <div className='flex items-center gap-3 mb-4'>
                    <img src={tweet.author.profileImageUrl} alt="profile" className='w-12 h-12 rounded-full border-2 border-orbit-teal' />
                    <div>
                        <h2 className='font-bold text-orbit-text'>{tweet.author.firstName}</h2>
                        <p className='text-orbit-faint text-sm'>@{tweet.author.username}</p>
                    </div>
                </div>
                <p className='text-orbit-text text-xl leading-relaxed mb-4'>{tweet.text}</p>
                {tweet.image?.url && <img src={tweet.image.url} className='rounded-2xl w-full border border-orbit-border mb-4' />}
                <p className='text-orbit-faint text-sm'>{timeSince(tweet.createdAt)}</p>
            </div>

            <div className='p-4'>
                <h3 className='text-orbit-text font-bold mb-4'>Comments</h3>
                {tweet.comments?.length > 0 ? (
                    tweet.comments.map((comment) => (
                        <div key={comment._id} className='flex gap-3 py-3 border-b border-orbit-border/50'>
                            <div className='w-8 h-8 rounded-full bg-orbit-card flex items-center justify-center text-xs text-orbit-teal'>
                                {comment.userId?.username?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                                <p className='text-orbit-teal text-xs font-bold'>@{comment.userId?.username || "user"}</p>
                                <p className='text-orbit-text text-sm'>{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-orbit-faint text-center py-10'>No comments yet. Be the first to reply!</p>
                )}
            </div>
        </div>
    );
};

export default TweetDetails;