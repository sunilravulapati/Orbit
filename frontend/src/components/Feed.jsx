import React from 'react';
import CreatePost from './CreatePost';
import Tweet from './Tweet';
import TweetSkeleton from './TweetSkeleton';
import useTweetStore from '../store/useTweetStore';

const Feed = () => {
    const tweets = useTweetStore((state) => state.tweets);

    return (
        <div className='w-[50%] border-l border-r border-orbit-border min-h-screen'>
            <CreatePost />
            {tweets === null ? (
                [...Array(5)].map((_, i) => <TweetSkeleton key={i} />)
            ) : tweets.length === 0 ? (
                <div className='flex flex-col items-center justify-center mt-24 px-8 text-center'>
                    <div className='text-4xl mb-4'>🪐</div>
                    <h2 className='text-orbit-text font-semibold text-xl mb-2'>Nothing in orbit yet</h2>
                    <p className='text-orbit-muted text-sm'>
                        Be the first to post or follow people to see their posts here.
                    </p>
                </div>
            ) : (
                tweets.map((tweet) => <Tweet key={tweet?._id} tweet={tweet} />)
            )}
        </div>
    )
}

export default Feed;