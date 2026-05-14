import React, { useState } from 'react';
import axios from "axios";
import { COMMON_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUserStore from '../store/useUserStore';
import logo from '../assets/logodesign2.png';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (isLogin) {
            try {
                const res = await axios.post(`${COMMON_API_END_POINT}/login`, { email, password }, {
                    headers: { 'Content-Type': "application/json" },
                    withCredentials: true
                });
                setUser(res?.data?.payload);
                if (res.data.message) {
                    navigate("/");
                    toast.success(res.data.message);
                }
            } catch (error) {
                toast.error(error?.response?.data?.error || "Something went wrong");
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const res = await axios.post(`${COMMON_API_END_POINT}/register`, {
                    firstName, username, email, password
                }, {
                    headers: { 'Content-Type': "application/json" },
                    withCredentials: true
                });
                if (res.data.message) {
                    setIsLogin(true);
                    toast.success(res.data.message);
                }
            } catch (error) {
                toast.error(error?.response?.data?.error || "Something went wrong");
            } finally {
                setLoading(false);
            }
        }
    };

    const loginSignupHandler = () => {
        setIsLogin(!isLogin);
        setFirstName(""); setUsername(""); setEmail(""); setPassword("");
    };

    return (
        <div className='w-screen h-screen flex items-center justify-center bg-orbit-bg overflow-hidden relative'>

            {/* Atmospheric background orbs */}
            <div className='absolute inset-0 pointer-events-none'>
                <div style={{
                    position: 'absolute', top: '-10%', left: '-5%',
                    width: '480px', height: '480px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(14,122,92,0.18) 0%, transparent 70%)',
                    filter: 'blur(40px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10%', right: '-5%',
                    width: '400px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(26,58,92,0.22) 0%, transparent 70%)',
                    filter: 'blur(50px)'
                }} />
                {/* subtle grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px'
                }} />
            </div>

            <div className='relative z-10 flex items-center justify-center gap-20 w-full max-w-5xl px-8'>

                {/* Left: Branding */}
                <div className='flex flex-col items-start gap-6 flex-1 max-w-sm'>
                    <div className='flex items-center gap-3'>
                        <img
                            src={logo}
                            alt="orbit-logo"
                            style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{
                            fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px',
                            color: 'var(--color-orbit-teal, #0e7a5c)'
                        }}>
                            Orbit
                        </span>
                    </div>

                    <div>
                        <h1 style={{
                            fontSize: '40px', fontWeight: '800', lineHeight: '1.1',
                            letterSpacing: '-1px', color: 'var(--color-orbit-text, #e7e9ea)'
                        }}>
                            What's orbiting<br />
                            <span style={{ color: 'var(--color-orbit-teal, #0e7a5c)' }}>
                                your mind?
                            </span>
                        </h1>
                        <p className='text-orbit-muted mt-15 text-[15px] leading-relaxed'>
                            Join the conversation. Share thoughts,<br />
                            connect with others, stay in the loop.
                        </p>
                    </div>

                    {/* decorative floating badges */}
                    <div className='flex gap-2 flex-wrap mt-2'>
                        {['#Explore', '#Connect', '#Share', '#Orbit'].map(tag => (
                            <span key={tag} style={{
                                fontSize: '12px', fontWeight: '600',
                                padding: '4px 12px', borderRadius: '999px',
                                border: '1px solid rgba(14,122,92,0.3)',
                                color: 'rgba(14,122,92,0.8)',
                                background: 'rgba(14,122,92,0.06)'
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: Form card */}
                <div style={{
                    background: 'rgba(30,39,50,0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '24px',
                    padding: '36px 32px',
                    width: '380px',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
                }}>
                    {/* Tab toggle */}
                    <div style={{
                        display: 'flex', gap: '4px', padding: '4px',
                        background: 'rgba(0,0,0,0.25)', borderRadius: '12px', marginBottom: '28px'
                    }}>
                        {['Sign in', 'Sign up'].map((label, i) => {
                            const active = (i === 0) === isLogin;
                            return (
                                <button
                                    key={label}
                                    onClick={() => { setIsLogin(i === 0); setFirstName(''); setUsername(''); setEmail(''); setPassword(''); }}
                                    style={{
                                        flex: 1, padding: '8px 0', borderRadius: '9px',
                                        fontSize: '13px', fontWeight: '600',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        border: 'none',
                                        background: active ? 'rgba(14,122,92,0.85)' : 'transparent',
                                        color: active ? '#fff' : 'var(--color-orbit-muted, #6e767d)',
                                        boxShadow: active ? '0 2px 8px rgba(14,122,92,0.3)' : 'none'
                                    }}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Heading */}
                    <div className='mb-5'>
                        <h2 style={{
                            fontSize: '20px', fontWeight: '700',
                            color: 'var(--color-orbit-text, #e7e9ea)',
                            letterSpacing: '-0.3px'
                        }}>
                            {isLogin ? 'Welcome back' : 'Create your account'}
                        </h2>
                        <p style={{ fontSize: '13px', color: 'var(--color-orbit-muted, #6e767d)', marginTop: '2px' }}>
                            {isLogin ? 'Sign in to continue to Orbit' : 'Start your journey today'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submitHandler} className='flex flex-col gap-3'>
                        {!isLogin && (
                            <div className='flex gap-2'>
                                <InputField
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder='First name'
                                />
                                <InputField
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder='Username'
                                />
                            </div>
                        )}
                        <InputField
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email address'
                        />
                        <InputField
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '8px', padding: '11px',
                                borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '14px', fontWeight: '700',
                                background: loading
                                    ? 'rgba(14,122,92,0.4)'
                                    : 'linear-gradient(135deg, #0e7a5c 0%, #0a5c45 100%)',
                                color: '#fff',
                                letterSpacing: '0.2px',
                                transition: 'all 0.2s',
                                boxShadow: loading ? 'none' : '0 4px 16px rgba(14,122,92,0.35)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                                    </svg>
                                    {isLogin ? 'Signing in…' : 'Creating account…'}
                                </>
                            ) : (
                                isLogin ? 'Sign in →' : 'Create Account →'
                            )}
                        </button>
                    </form>

                    {/* Divider + switch */}
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', color: 'var(--color-orbit-muted, #6e767d)' }}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            {' '}
                            <span
                                onClick={loginSignupHandler}
                                style={{
                                    color: 'var(--color-orbit-teal, #0e7a5c)',
                                    fontWeight: '600', cursor: 'pointer',
                                    textDecoration: 'underline', textUnderlineOffset: '2px'
                                }}
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

// Reusable input with consistent dark styling
const InputField = ({ type, value, onChange, placeholder }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        style={{
            flex: 1, width: '100%',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--color-orbit-text, #e7e9ea)',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={e => {
            e.target.style.borderColor = 'rgba(14,122,92,0.6)';
            e.target.style.boxShadow = '0 0 0 3px rgba(14,122,92,0.12)';
        }}
        onBlur={e => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            e.target.style.boxShadow = 'none';
        }}
    />
);

export default Login;