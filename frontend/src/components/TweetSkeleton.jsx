import React from 'react';

const TweetSkeleton = () => {
    return (
        <div className='border-b border-orbit-border p-4 animate-pulse'>
            <div className='flex gap-3'>
                <div className='w-9 h-9 rounded-full bg-orbit-card shrink-0' />
                <div className='flex-1 space-y-2'>
                    <div className='flex gap-2'>
                        <div className='h-3 bg-orbit-card rounded-full w-24' />
                        <div className='h-3 bg-orbit-card rounded-full w-16' />
                    </div>
                    <div className='h-3 bg-orbit-card rounded-full w-full' />
                    <div className='h-3 bg-orbit-card rounded-full w-4/5' />
                    <div className='h-3 bg-orbit-card rounded-full w-3/5' />
                    <div className='flex gap-6 mt-3'>
                        <div className='h-3 bg-orbit-card rounded-full w-8' />
                        <div className='h-3 bg-orbit-card rounded-full w-8' />
                        <div className='h-3 bg-orbit-card rounded-full w-8' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TweetSkeleton;