import React, { useState, useRef } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import useUserStore from '../store/useUserStore';
import { CiCamera } from "react-icons/ci";

const EditProfile = () => {
    const user = useUserStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser);

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [username, setUsername] = useState(user?.username || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user?.profileImageUrl || null);
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let currentProfileImageUrl = user?.profileImageUrl;

            // Upload avatar if new file selected
            if (avatarFile) {
                const formData = new FormData();
                formData.append("image", avatarFile);

                const uploadRes = await axios.patch(
                    `${USER_API_END_POINT}/update-avatar`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );

                currentProfileImageUrl = uploadRes.data.payload.profileImageUrl;
            }

            // Update profile
            await axios.patch(
                `${USER_API_END_POINT}/update-user`,
                { firstName, lastName, username, bio, profileImageUrl: currentProfileImageUrl },
                { withCredentials: true }
            );

            // Update global store
            updateUser({ firstName, lastName, username, bio, profileImageUrl: currentProfileImageUrl });

            toast.success("Profile updated!");
            navigate(-1);
        } catch (error) {
            toast.error(error?.response?.data?.error || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full border-l border-r border-orbit-border min-h-screen'>
            {/* Header */}
            <div className='flex items-center py-2 px-3 border-b border-orbit-border bg-orbit-bg sticky top-0 z-10'>
                <Link to={`/profile/${user?.userId}`} className='p-2 rounded-full hover:bg-orbit-card cursor-pointer'>
                    <IoMdArrowBack size="24px" className='text-orbit-text' />
                </Link>
                <h1 className='font-semibold text-orbit-text ml-2'>Edit Profile</h1>
            </div>

            <div className='p-6'>
                {/* Avatar upload */}
                <div className='flex flex-col items-center mb-6'>
                    <div className='relative'>
                        <div className='w-24 h-24 rounded-full bg-orbit-card border-4 border-orbit-bg overflow-hidden flex items-center justify-center text-orbit-teal font-semibold text-3xl'>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="avatar" className='w-full h-full object-cover' />
                            ) : (
                                (user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase()
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className='absolute bottom-0 right-0 w-8 h-8 bg-orbit-teal-dark hover:bg-orbit-teal rounded-full flex items-center justify-center border-2 border-orbit-bg transition-colors'
                        >
                            <CiCamera size="16px" className='text-white' />
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            className='hidden'
                        />
                    </div>
                    {avatarFile && (
                        <p className='text-orbit-teal text-xs mt-2'>
                            New photo selected — will upload on save
                        </p>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={submitHandler} className='flex flex-col gap-4'>
                    <div>
                        <label className='text-orbit-muted text-xs mb-1 block'>First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className='w-full bg-orbit-card border border-orbit-border text-orbit-text px-4 py-2.5 rounded-xl text-sm outline-none focus:border-orbit-teal transition-colors'
                            placeholder='First Name'
                        />
                    </div>
                    <div>
                        <label className='text-orbit-muted text-xs mb-1 block'>Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className='w-full bg-orbit-card border border-orbit-border text-orbit-text px-4 py-2.5 rounded-xl text-sm outline-none focus:border-orbit-teal transition-colors'
                            placeholder='Last Name'
                        />
                    </div>
                    <div>
                        <label className='text-orbit-muted text-xs mb-1 block'>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-full bg-orbit-card border border-orbit-border text-orbit-text px-4 py-2.5 rounded-xl text-sm outline-none focus:border-orbit-teal transition-colors'
                            placeholder='Username'
                        />
                    </div>
                    <div>
                        <label className='text-orbit-muted text-xs mb-1 block'>Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className='w-full bg-orbit-card border border-orbit-border text-orbit-text px-4 py-2.5 rounded-xl text-sm outline-none focus:border-orbit-teal transition-colors resize-none'
                            placeholder='Tell people about yourself'
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className='bg-orbit-teal-dark hover:bg-orbit-teal hover:text-orbit-bg text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;