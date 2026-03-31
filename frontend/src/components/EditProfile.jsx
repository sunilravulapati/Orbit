import React, { useState, useRef, useEffect } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import useUserStore from '../store/useUserStore';
import useTweetStore from '../store/useTweetStore';
import { CiCamera } from "react-icons/ci";

const EditProfile = () => {
    const user = useUserStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser);
    const toggleRefresh = useTweetStore((state) => state.toggleRefresh);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.userId) return;
            try {
                const res = await axios.get(`${USER_API_END_POINT}/users`, { withCredentials: true });
                const fullUser = res.data.payload?.find(u => u._id === user.userId);
                if (fullUser) {
                    setFirstName(fullUser.firstName || "");
                    setLastName(fullUser.lastName || "");
                    setUsername(fullUser.username || "");
                    setBio(fullUser.bio || "");
                    setAvatarPreview(fullUser.profileImageUrl || null);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setUsername(user.username || "");
            setBio(user.bio || "");
            setAvatarPreview(user.profileImageUrl || null);
            if (!user.firstName || !user.username) fetchUserData();
        }
    }, [user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const uploadAvatar = async () => {
        if (!avatarFile) return null;
        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append("image", avatarFile);
            const res = await axios.patch(`${USER_API_END_POINT}/update-avatar`, formData, { withCredentials: true });
            const newUrl = res.data.payload.profileImageUrl;
            updateUser({ profileImageUrl: newUrl });
            setAvatarFile(null);
            return newUrl;
        } catch (error) {
            toast.error(error?.response?.data?.error || "Upload failed");
            return null;
        } finally {
            setUploadingAvatar(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let currentAvatarUrl = user?.profileImageUrl;
            if (avatarFile) {
                const uploadedUrl = await uploadAvatar();
                if (uploadedUrl) {
                    currentAvatarUrl = uploadedUrl;
                } else {
                    setLoading(false);
                    return;
                }
            }
            const res = await axios.patch(
                `${USER_API_END_POINT}/update-user`,
                { firstName, lastName, username, bio, profileImageUrl: currentAvatarUrl },
                { withCredentials: true }
            );
            updateUser({ firstName, lastName, username, bio, profileImageUrl: currentAvatarUrl });
            toast.success(res.data.message);
            toggleRefresh();
            navigate(-1);
        } catch (error) {
            toast.error(error?.response?.data?.error || "Something went wrong");
        }
        setLoading(false);
    };

    const displayName = firstName
        ? `${firstName} ${lastName || ''}`.trim()
        : user?.username || "U";

    const isBusy = loading || uploadingAvatar;

    return (
        <div className='w-[50%] border-l border-r border-orbit-border min-h-screen bg-orbit-bg'>

            {/* ── Header ── */}
            <div className='flex items-center gap-6 py-3 px-4 border-b border-orbit-border bg-orbit-bg/90 backdrop-blur sticky top-0 z-10'>
                <Link
                    to={`/profile/${user?.userId}`}
                    className='p-2 rounded-full hover:bg-orbit-surface transition-colors'
                >
                    <IoMdArrowBack size={20} className='text-orbit-text' />
                </Link>
                <div className='flex-1'>
                    <h1 className='font-bold text-[17px] text-orbit-text'>Edit profile</h1>
                </div>
                {/* Save button in header (Twitter-style) */}
                <button
                    type="button"
                    onClick={submitHandler}
                    disabled={isBusy}
                    className='px-4 py-1.5 bg-orbit-text text-orbit-bg rounded-full text-sm font-bold hover:bg-orbit-text/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isBusy ? "Saving…" : "Save"}
                </button>
            </div>

            <div className='pb-10'>
                {/* ── Banner placeholder ── */}
                <div
                    className='h-32 w-full relative'
                    style={{ background: 'linear-gradient(135deg, #0e7a5c 0%, #1a3a5c 100%)' }}
                />

                {/* ── Avatar ── */}
                <div className='px-4 -mt-10 mb-6'>
                    <div className='relative inline-block'>
                        <div className='w-24 h-24 rounded-full bg-orbit-surface border-4 border-orbit-bg overflow-hidden flex items-center justify-center text-orbit-teal font-bold text-3xl shadow-lg'>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="avatar" className='w-full h-full object-cover' />
                            ) : (
                                displayName[0]?.toUpperCase() || "U"
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className='absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'
                        >
                            <CiCamera size={22} className='text-white' />
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
                        <p className='text-orbit-teal text-xs mt-2 ml-1'>New photo ready — saves with your profile</p>
                    )}
                </div>

                {/* ── Form fields ── */}
                <div className='px-4 flex flex-col gap-4'>
                    <FloatingInput
                        label="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        maxLength={50}
                    />
                    <FloatingInput
                        label="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        maxLength={50}
                    />
                    <FloatingInput
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={30}
                        prefix="@"
                    />
                    <FloatingTextarea
                        label="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={160}
                        rows={3}
                    />
                </div>
            </div>
        </div>
    );
};

/* Floating-label input — Twitter edit profile style */
const FloatingInput = ({ label, value, onChange, maxLength, prefix }) => (
    <div className='relative border border-orbit-border rounded-md px-3 pt-5 pb-2 bg-orbit-surface/30 focus-within:border-orbit-teal transition-colors group'>
        <label className='absolute top-1.5 left-3 text-[11px] text-orbit-muted group-focus-within:text-orbit-teal transition-colors'>
            {label}
        </label>
        <div className='flex items-center gap-0.5'>
            {prefix && <span className='text-orbit-muted text-sm'>{prefix}</span>}
            <input
                type="text"
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                className='flex-1 bg-transparent text-orbit-text text-[15px] outline-none placeholder:text-orbit-muted'
            />
        </div>
        {maxLength && (
            <span className='absolute top-2 right-3 text-[11px] text-orbit-muted'>
                {value.length}/{maxLength}
            </span>
        )}
    </div>
);

const FloatingTextarea = ({ label, value, onChange, maxLength, rows }) => (
    <div className='relative border border-orbit-border rounded-md px-3 pt-5 pb-2 bg-orbit-surface/30 focus-within:border-orbit-teal transition-colors group'>
        <label className='absolute top-1.5 left-3 text-[11px] text-orbit-muted group-focus-within:text-orbit-teal transition-colors'>
            {label}
        </label>
        <textarea
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            rows={rows}
            className='w-full bg-transparent text-orbit-text text-[15px] outline-none resize-none placeholder:text-orbit-muted'
        />
        {maxLength && (
            <span className='absolute top-2 right-3 text-[11px] text-orbit-muted'>
                {value.length}/{maxLength}
            </span>
        )}
    </div>
);

export default EditProfile;