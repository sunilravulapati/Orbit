import React from 'react';
import { CiHeart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { FaRetweet } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';

const Notifications = () => {
  const notifications = [
    { id: 1, type: "like", icon: <CiHeart size="18px" />, color: "text-pink-400", bg: "bg-pink-400/10", text: "Someone liked your post", time: "2m ago" },
    { id: 2, type: "follow", icon: <CiUser size="18px" />, color: "text-orbit-teal", bg: "bg-orbit-tealDark/20", text: "Someone followed you", time: "10m ago" },
    { id: 3, type: "repost", icon: <FaRetweet size="16px" />, color: "text-green-400", bg: "bg-green-400/10", text: "Someone reposted your post", time: "1h ago" },
    { id: 4, type: "like", icon: <CiHeart size="18px" />, color: "text-pink-400", bg: "bg-pink-400/10", text: "Someone liked your post", time: "3h ago" },
  ];

  return (
    <div className='w-[50%] border-l border-r border-orbit-border min-h-screen'>

      {/* Header */}
      <div className='flex items-center py-2 px-3 border-b border-orbit-border bg-orbit-bg sticky top-0 z-10'>
        <Link to="/" className='p-2 rounded-full hover:bg-orbit-card cursor-pointer'>
          <IoMdArrowBack size="24px" className='text-orbit-text' />
        </Link>
        <h1 className='font-semibold text-orbit-text ml-2'>Notifications</h1>
      </div>

      {/* Notifications list */}
      {notifications.map((n) => (
        <div key={n.id} className='flex items-center gap-4 px-4 py-4 hover:bg-orbit-card cursor-pointer transition-colors border-b border-orbit-border'>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.bg} ${n.color}`}>
            {n.icon}
          </div>
          <div className='flex-1'>
            <p className='text-orbit-text text-sm'>{n.text}</p>
          </div>
          <p className='text-orbit-faint text-xs'>{n.time}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;