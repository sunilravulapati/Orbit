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
            <div className='flex items-center gap-5 py-3 px-4 border-b border-orbit-border bg-orbit-bg/80 backdrop-blur-md sticky top-0 z-10'>
                <Link
                    to={`/profile/${user?.userId}`}
                    className='p-2 rounded-full hover:bg-orbit-surface/70 transition-all duration-200 group'
                >
                    <IoMdArrowBack size={19} className='text-orbit-muted group-hover:text-orbit-text transition-colors' />
                </Link>
                <div className='flex-1'>
                    <h1 className='font-bold text-[17px] text-orbit-text tracking-tight'>Edit profile</h1>
                    <p className='text-[12px] text-orbit-muted leading-none mt-0.5'>
                        {displayName}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={submitHandler}
                    disabled={isBusy}
                    className='relative px-5 py-2 bg-orbit-text text-orbit-bg rounded-full text-[13px] font-bold tracking-tight hover:bg-orbit-text/85 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden'
                >
                    <span className={`transition-opacity duration-150 ${isBusy ? 'opacity-0' : 'opacity-100'}`}>
                        Save
                    </span>
                    {isBusy && (
                        <span className='absolute inset-0 flex items-center justify-center gap-1'>
                            <span className='w-1.5 h-1.5 rounded-full bg-orbit-bg animate-bounce [animation-delay:0ms]' />
                            <span className='w-1.5 h-1.5 rounded-full bg-orbit-bg animate-bounce [animation-delay:150ms]' />
                            <span className='w-1.5 h-1.5 rounded-full bg-orbit-bg animate-bounce [animation-delay:300ms]' />
                        </span>
                    )}
                </button>
            </div>

            <div className='pb-12'>
                {/* ── Banner ── */}
                <div className='h-36 w-full relative overflow-hidden'>
                    <div
                        className='absolute inset-0'
                        style={{
                            background: 'linear-gradient(135deg, #0e7a5c 0%, #0f5a4a 40%, #1a3a5c 100%)',
                        }}
                    />
                    {/* subtle grid overlay */}
                    <div
                        className='absolute inset-0 opacity-10'
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.15) 24px, rgba(255,255,255,0.15) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,0.15) 24px, rgba(255,255,255,0.15) 25px)',
                        }}
                    />
                </div>

                {/* ── Avatar section ── */}
                <div className='px-5 -mt-12 mb-5 flex items-end justify-between'>
                    <div className='relative group'>
                        <div className='w-24 h-24 rounded-full bg-orbit-surface border-[3px] border-orbit-bg overflow-hidden flex items-center justify-center text-orbit-teal font-bold text-3xl shadow-md'>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="avatar" className='w-full h-full object-cover' />
                            ) : (
                                <span className='text-2xl font-bold'>
                                    {displayName[0]?.toUpperCase() || "U"}
                                </span>
                            )}
                        </div>
                        {/* hover overlay */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className='absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[2px]'
                        >
                            <CiCamera size={20} className='text-white' />
                            <span className='text-white text-[10px] font-semibold tracking-wide'>CHANGE</span>
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
                        <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orbit-teal/10 border border-orbit-teal/20 mb-1'>
                            <span className='w-1.5 h-1.5 rounded-full bg-orbit-teal animate-pulse' />
                            <span className='text-orbit-teal text-[11px] font-medium'>New photo ready</span>
                        </div>
                    )}
                </div>

                {/* ── Divider label ── */}
                <div className='px-5 mb-4'>
                    <p className='text-[11px] font-semibold text-orbit-muted uppercase tracking-widest mb-4'>
                        Profile info
                    </p>
                    <div className='flex flex-col gap-3'>
                        <div className='grid grid-cols-2 gap-3'>
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
                        </div>
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

                {/* ── Character limit ring visual ── */}
                {bio.length > 130 && (
                    <div className='px-5 mt-1'>
                        <div className={`text-[12px] font-medium transition-colors ${bio.length >= 160 ? 'text-red-400' : 'text-orbit-teal'}`}>
                            {160 - bio.length} characters remaining
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── Floating-label input ── */
const FloatingInput = ({ label, value, onChange, maxLength, prefix }) => (
    <div className='relative border border-orbit-border rounded-xl px-3 pt-6 pb-2.5 bg-orbit-surface/20 focus-within:border-orbit-teal focus-within:bg-orbit-surface/40 hover:border-orbit-border/80 transition-all duration-200 group'>
        <label className='absolute top-2 left-3 text-[10.5px] font-semibold text-orbit-muted group-focus-within:text-orbit-teal transition-colors tracking-wide uppercase'>
            {label}
        </label>
        <div className='flex items-center gap-0.5'>
            {prefix && <span className='text-orbit-muted text-[14px] mr-0.5 select-none'>{prefix}</span>}
            <input
                type="text"
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                className='flex-1 bg-transparent text-orbit-text text-[14px] outline-none placeholder:text-orbit-muted/50 min-w-0'
            />
        </div>
        {maxLength && value.length > maxLength * 0.7 && (
            <span className={`absolute top-2 right-3 text-[10px] font-medium transition-colors ${value.length >= maxLength ? 'text-red-400' : 'text-orbit-muted'}`}>
                {value.length}/{maxLength}
            </span>
        )}
    </div>
);

/* ── Floating-label textarea ── */
const FloatingTextarea = ({ label, value, onChange, maxLength, rows }) => (
    <div className='relative border border-orbit-border rounded-xl px-3 pt-6 pb-2.5 bg-orbit-surface/20 focus-within:border-orbit-teal focus-within:bg-orbit-surface/40 hover:border-orbit-border/80 transition-all duration-200 group'>
        <label className='absolute top-2 left-3 text-[10.5px] font-semibold text-orbit-muted group-focus-within:text-orbit-teal transition-colors tracking-wide uppercase'>
            {label}
        </label>
        <textarea
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            rows={rows}
            className='w-full bg-transparent text-orbit-text text-[14px] outline-none resize-none placeholder:text-orbit-muted/50 leading-relaxed'
        />
        {maxLength && (
            <div className='flex justify-end mt-1'>
                <span className={`text-[10px] font-medium transition-colors ${value.length >= maxLength ? 'text-red-400' : value.length > maxLength * 0.8 ? 'text-amber-400' : 'text-orbit-muted'}`}>
                    {value.length}/{maxLength}
                </span>
            </div>
        )}
    </div>
);

export default EditProfile;