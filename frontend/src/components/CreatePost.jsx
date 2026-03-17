import React, { useState, useRef } from 'react';
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

    const user = useUserStore((state) => state.user);
    const isActive = useTweetStore((state) => state.isActive);
    const toggleRefresh = useTweetStore((state) => state.toggleRefresh);
    const setIsActive = useTweetStore((state) => state.setIsActive);

    const submitHandler = async () => {
        try {
            const formData = new FormData();
            formData.append("text", description);
            if (selectedImage) {
                formData.append("image", selectedImage);
            }
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
    }

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
                    {
                        role: "user",
                        content: `Enhance this post: "${description}"`
                    }
                ]
            })
        });
        const data = await response.json();
        console.log("Groq response:", data);
        const enhanced = data.choices?.[0]?.message?.content;
        if (enhanced) {
            setDescription(enhanced.trim());
            toast.success("Post enhanced!");
        } else {
            toast.error("No response from AI.");
        }
    } catch (error) {
        toast.error("AI enhancement failed. Try again.");
        console.error(error);
    }
    setEnhancing(false);
}

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setSelectedImage(file); setPreview(URL.createObjectURL(file)); }
    }

    const removeImage = () => {
        setSelectedImage(null);
        setPreview(null);
        fileInputRef.current.value = null;
    }

    return (
        <div className='w-full'>
            <div className='flex border-b border-orbit-border'>
                <div onClick={() => setIsActive(true)} className={`${isActive ? "border-b-2 border-orbit-teal text-orbit-teal" : "text-orbit-muted"} cursor-pointer hover:bg-orbit-card w-full text-center px-4 py-3 transition-colors`}>
                    <h1 className='font-medium text-sm'>For you</h1>
                </div>
                <div onClick={() => setIsActive(false)} className={`${!isActive ? "border-b-2 border-orbit-teal text-orbit-teal" : "text-orbit-muted"} cursor-pointer hover:bg-orbit-card w-full text-center px-4 py-3 transition-colors`}>
                    <h1 className='font-medium text-sm'>Following</h1>
                </div>
            </div>

            <div className='flex items-start gap-3 p-4 border-b border-orbit-border'>
                <div className='w-9 h-9 rounded-full bg-orbit-teal-dark border-2 border-orbit-teal flex items-center justify-center text-orbit-teal font-medium text-sm shrink-0'>
                    {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div className='flex-1'>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className='w-full bg-orbit-card border border-orbit-border rounded-xl px-4 py-2 text-sm text-orbit-text placeholder-orbit-faint outline-none focus:border-orbit-teal transition-colors resize-none'
                        placeholder="What's orbiting your mind?"
                    />
                    {preview && (
                        <div className='relative mt-3 inline-block'>
                            <img src={preview} alt="preview" className='max-h-48 rounded-xl border border-orbit-border object-cover' />
                            <button onClick={removeImage} className='absolute top-1 right-1 bg-orbit-bg text-orbit-text rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-orbit-card border border-orbit-border'>✕</button>
                        </div>
                    )}
                    <div className='flex items-center justify-between mt-3'>
                        <div className='flex items-center gap-3'>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className='hidden' />
                            <CiImageOn size="20px" className='text-orbit-muted cursor-pointer hover:text-orbit-teal transition-colors' onClick={() => fileInputRef.current.click()} />
                            <button onClick={enhanceWithAI} disabled={enhancing}
                                className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-orbit-teal-dark text-orbit-teal hover:bg-orbit-teal-dark hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                                <BsStars size="13px" />
                                {enhancing ? "Enhancing..." : "Enhance with AI"}
                            </button>
                        </div>
                        <button onClick={submitHandler} className='bg-orbit-teal-dark hover:bg-orbit-teal hover:text-orbit-bg text-white px-5 py-1.5 text-sm rounded-full transition-colors font-medium'>
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost;