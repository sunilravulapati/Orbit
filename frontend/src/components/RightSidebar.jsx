import React from 'react';
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';

const dummyUsers = [
    { _id: '1', name: 'Alex Nova', username: 'alexnova' },
    { _id: '2', name: 'Sara Patel', username: 'sarapatel' },
    { _id: '3', name: 'Mike Khan', username: 'mikekhan' },
];

const RightSidebar = ({ otherUsers }) => {
    const users = otherUsers?.length ? otherUsers : dummyUsers;

    return (
        <div className='w-[30%] px-4 py-4 sticky top-0 h-screen overflow-y-auto'>
            <div className='flex items-center gap-2 px-3 py-2 bg-orbit-card border border-orbit-border rounded-full mb-4'>
                <CiSearch size="18px" className='text-orbit-faint shrink-0' />
                <input type="text" className='bg-transparent outline-none text-sm text-orbit-text w-full min-w-0' placeholder='Search Orbit' />
            </div>
            <div className='bg-orbit-card border border-orbit-border rounded-2xl p-4'>
                <h1 className='font-semibold text-sm text-orbit-text mb-3'>Who to follow</h1>
                {users?.map((user) => (
                    <div key={user?._id} className='flex items-center justify-between py-2 gap-2'>
                        <div className='flex items-center gap-2 min-w-0'>
                            <div className='w-8 h-8 rounded-full bg-orbit-teal-dark border border-orbit-teal flex items-center justify-center text-orbit-teal text-xs font-medium shrink-0'>
                                {user?.name?.[0] || "U"}
                            </div>
                            <div className='min-w-0'>
                                <h1 className='font-medium text-xs text-orbit-text truncate'>{user?.name}</h1>
                                <p className='text-orbit-faint text-xs truncate'>{`@${user?.username}`}</p>
                            </div>
                        </div>
                        <Link to={`/profile/${user?._id}`} className='shrink-0'>
                            <button className='text-xs px-3 py-1 rounded-full border border-orbit-teal-dark text-orbit-teal hover:bg-orbit-teal-dark hover:text-white transition-colors whitespace-nowrap'>
                                Profile
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RightSidebar;