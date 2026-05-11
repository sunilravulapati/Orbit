import React, { useState, useRef, useEffect } from 'react';
import { CiImageOn } from "react-icons/ci";
import { BsStars } from "react-icons/bs";
import axios from "axios";
import { POST_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import useUserStore from '../store/useUserStore';
import useTweetStore from '../store/useTweetStore';

const CreatePost = () => {
    const [description, setDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [enhancing, setEnhancing] = useState(false);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const user = useUserStore((state) => state.user);
    const isActive = useTweetStore((state) => state.isActive);
    const toggleRefresh = useTweetStore((state) => state.toggleRefresh);
    const setIsActive = useTweetStore((state) => state.setIsActive);
    const composerFocus = useTweetStore((state) => state.composerFocus);
    const clearComposerFocus = useTweetStore((state) => state.clearComposerFocus);

    const submitHandler = async () => {
        if (!description.trim() && !selectedImage) return toast.error("Write something first!");
        try {
            const formData = new FormData();
            formData.append("text", description);
            if (selectedImage) formData.append("image", selectedImage);
            const res = await axios.post(`${POST_API_END_POINT}/create-post`, formData, {
                withCredentials: true
            });
            toggleRefresh();
            if (res.data.message) toast.success(res.data.message);
        } catch (error) {
            toast.error(error?.response?.data?.error || "Something went wrong");
        }
        setDescription("");
        setSelectedImage(null);
        setPreview(null);
    };

    const enhanceWithAI = async () => {
        if (!description.trim()) { toast.error("Write something first!"); return; }
        setEnhancing(true);
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    max_tokens: 300,
                    messages: [
                        {
                            role: "system",
                            content: "You are a social media expert. Enhance posts to be engaging and impactful. Always keep responses under 280 characters. Return only the enhanced post text — no quotes, no explanation, nothing else."
                        },
                        { role: "user", content: `Enhance this post: "${description}"` }
                    ]
                })
            });
            const data = await response.json();
            const enhanced = data.choices?.[0]?.message?.content;
            if (enhanced) { setDescription(enhanced.trim()); toast.success("Post enhanced!"); }
            else toast.error("No response from AI.");
        } catch (error) {
            toast.error("AI enhancement failed. Try again.");
        }
        setEnhancing(false);
    };

    useEffect(() => {
        if (composerFocus && textareaRef.current) {
            textareaRef.current.focus();
            clearComposerFocus();
        }
    }, [composerFocus, clearComposerFocus]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setSelectedImage(file); setPreview(URL.createObjectURL(file)); }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const avatarLetter = (user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase();

    return (
        <div className='w-full'>
            {/* ── Tabs ── */}
            <div className='flex border-b border-orbit-border sticky top-0 bg-orbit-bg/90 backdrop-blur z-10'>
                {[['For you', true], ['Following', false]].map(([label, active]) => (
                    <button
                        key={label}
                        onClick={() => setIsActive(active)}
                        className={`flex-1 py-3.5 text-sm font-medium relative transition-colors hover:bg-orbit-card/50 ${
                            isActive === active ? 'text-orbit-text' : 'text-orbit-muted'
                        }`}
                    >
                        {label}
                        {isActive === active && (
                            <span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-orbit-teal rounded-full' />
                        )}
                    </button>
                ))}
            </div>

            {/* ── Composer ── */}
            <div className='flex items-start gap-3 p-4 border-b border-orbit-border'>
                {/* Avatar — shows profile image if available */}
                <div className='w-10 h-10 rounded-full bg-orbit-surface border border-orbit-border flex items-center justify-center text-orbit-teal font-semibold text-sm shrink-0 overflow-hidden'>
                    {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="avatar" className='w-full h-full object-cover' />
                    ) : (
                        <span>{avatarLetter}</span>
                    )}
                </div>

                <div className='flex-1'>
                    <textarea
                        ref={textareaRef}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className='w-full bg-transparent border-b border-orbit-border pb-3 text-[15px] text-orbit-text placeholder-orbit-muted outline-none resize-none focus:border-orbit-teal transition-colors'
                        placeholder="What's orbiting your mind?"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) submitHandler();
                        }}
                    />

                    {/* Image preview */}
                    {preview && (
                        <div className='relative mt-2 inline-block'>
                            <img src={preview} alt="preview" className='max-h-52 rounded-2xl border border-orbit-border object-cover' />
                            <button
                                onClick={removeImage}
                                className='absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/80 transition-colors'
                            >✕</button>
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className='flex items-center justify-between mt-3'>
                        <div className='flex items-center gap-2'>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className='hidden' />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className='p-2 rounded-full hover:bg-orbit-teal/10 text-orbit-muted hover:text-orbit-teal transition-colors'
                            >
                                <CiImageOn size={20} />
                            </button>
                            <button
                                onClick={enhanceWithAI}
                                disabled={enhancing}
                                className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-orbit-teal/30 text-orbit-teal hover:bg-orbit-teal/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                <BsStars size={13} />
                                {enhancing ? "Enhancing…" : "Enhance"}
                            </button>
                        </div>
                        <div className='flex items-center gap-2'>
                            {description.length > 0 && (
                                <span className={`text-xs ${description.length > 260 ? 'text-red-400' : 'text-orbit-muted'}`}>
                                    {280 - description.length}
                                </span>
                            )}
                            <button
                                onClick={submitHandler}
                                disabled={!description.trim() && !selectedImage}
                                className='bg-orbit-teal text-orbit-bg px-5 py-1.5 text-sm rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed'
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;