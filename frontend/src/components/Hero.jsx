import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logodesign.png';

// ── mock feed data shown in the hero preview ──────────────────────────────────
const MOCK_POSTS = [
    {
        id: 1, avatar: '🚀', name: 'Arjun K', handle: 'arjun29', time: '2m',
        text: 'Just shipped a new feature using Groq + Llama 3. The speed is insane ⚡ #AI #Dev',
        likes: 24, comments: 6, ai: true
    },
    {
        id: 2, avatar: '🌙', name: 'Shane Watson', handle: 'Shane', time: '8m',
        text: 'Hot take: dark mode isn\'t a preference, it\'s a personality trait. Fight me.',
        likes: 89, comments: 31, ai: false
    },
    {
        id: 3, avatar: '⚡', name: 'sunil r', handle: 'sunny1', time: '15m',
        text: 'Day 50 of LeetCode. The grind is real but so is the growth. Who else is grinding? #LeetCode',
        likes: 47, comments: 12, ai: true
    },
];

const FEATURES = [
    {
        icon: '✦',
        title: 'AI-Enhanced Posts',
        desc: 'One click to refine your thoughts. Orbit\'s AI polishes your post before you share it.',
        color: '#0e7a5c'
    },
    {
        icon: '◎',
        title: 'Smart Reply Suggestions',
        desc: 'Open a comment box and instantly get 3 contextual AI-generated reply ideas.',
        color: '#1a6b8a'
    },
    {
        icon: '◈',
        title: 'Real-time Notifications',
        desc: 'Socket.io-powered live alerts — know the moment someone likes, replies, or follows you.',
        color: '#5a3e8a'
    },
    {
        icon: '◇',
        title: 'Bookmark Everything',
        desc: 'Save posts to revisit later. Your curated reading list, always one tap away.',
        color: '#8a5a1a'
    },
    {
        icon: '◉',
        title: 'Explore & Discover',
        desc: 'Full-text search across posts and people. Find what matters in seconds.',
        color: '#1a4a8a'
    },
    {
        icon: '✧',
        title: 'Clean, Fast, Minimal',
        desc: 'No ads. No algorithmic manipulation. No dark patterns. Just people and ideas.',
        color: '#8a1a3e'
    },
];

const COMPARE = [
    { label: 'Ad-free experience', orbit: true, x: false, threads: false },
    { label: 'AI reply suggestions', orbit: true, x: false, threads: false },
    { label: 'AI post enhancement', orbit: true, x: false, threads: false },
    { label: 'Open source spirit', orbit: true, x: false, threads: true },
    { label: 'No algorithmic feed manipulation', orbit: true, x: false, threads: false },
    { label: 'Real-time notifications', orbit: true, x: true, threads: true },
    { label: 'Bookmark posts', orbit: true, x: true, threads: false },
];

// ── tiny animated counter ─────────────────────────────────────────────────────
const Counter = ({ target, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                let start = 0;
                const step = Math.ceil(target / 40);
                const t = setInterval(() => {
                    start = Math.min(start + step, target);
                    setCount(start);
                    if (start >= target) clearInterval(t);
                }, 30);
                obs.disconnect();
            }
        });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target]);
    return <span ref={ref}>{count}{suffix}</span>;
};

const Hero = () => {
    const navigate = useNavigate();
    const [hoveredPost, setHoveredPost] = useState(null);

    return (
        <div style={{
            minHeight: '100vh', background: '#0d1117',
            color: '#e7e9ea', fontFamily: "'DM Sans', system-ui, sans-serif",
            overflowX: 'hidden'
        }}>

            {/* ── Google Font ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
                * { box-sizing: border-box; }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
                @keyframes slide-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
                @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                .ai-badge {
                    background: linear-gradient(90deg, #0e7a5c22, #0e7a5c44, #0e7a5c22);
                    background-size: 200% 100%;
                    animation: shimmer 2.5s linear infinite;
                }
            `}</style>

            {/* ── Nav ── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 50,
                backdropFilter: 'blur(16px)',
                background: 'rgba(13,17,23,0.85)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                padding: '0 32px', height: '60px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={logo} alt="Orbit" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <span style={{ fontWeight: 800, fontSize: '18px', color: '#0e7a5c', letterSpacing: '-0.5px' }}>
                        Orbit
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '7px 20px', borderRadius: '999px', fontSize: '13px',
                            fontWeight: 600, cursor: 'pointer',
                            border: '1px solid rgba(14,122,92,0.4)',
                            background: 'transparent', color: '#0e7a5c',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.target.style.background = 'rgba(14,122,92,0.1)'; }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; }}
                    >
                        Sign in
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '7px 20px', borderRadius: '999px', fontSize: '13px',
                            fontWeight: 700, cursor: 'pointer', border: 'none',
                            background: 'linear-gradient(135deg, #0e7a5c, #0a5c45)',
                            color: '#fff', boxShadow: '0 2px 12px rgba(14,122,92,0.35)',
                            transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={e => { e.target.style.opacity = '0.85'; }}
                        onMouseLeave={e => { e.target.style.opacity = '1'; }}
                    >
                        Get started →
                    </button>
                </div>
            </nav>

            {/* ── Hero section ── */}
            <section style={{
                maxWidth: '1100px', margin: '0 auto', padding: '90px 32px 60px',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center'
            }}>
                {/* Left */}
                <div style={{ animation: 'slide-up 0.6s ease both' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '5px 14px', borderRadius: '999px', marginBottom: '24px',
                        border: '1px solid rgba(14,122,92,0.35)',
                        background: 'rgba(14,122,92,0.08)', fontSize: '12px',
                        color: '#0e7a5c', fontWeight: 600, letterSpacing: '0.5px'
                    }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0e7a5c', display: 'inline-block', position: 'relative' }}>
                            <span style={{
                                position: 'absolute', inset: '-3px', borderRadius: '50%',
                                border: '1px solid #0e7a5c', animation: 'pulse-ring 1.5s ease-out infinite'
                            }} />
                        </span>
                        Now with AI-powered features
                    </div>

                    <h1 style={{
                        fontSize: '56px', fontWeight: 800, lineHeight: 1.05,
                        letterSpacing: '-2px', marginBottom: '20px'
                    }}>
                        The social network<br />
                        that{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #0e7a5c, #4db896)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            works for you
                        </span>
                    </h1>

                    <p style={{
                        fontSize: '17px', color: '#8b949e', lineHeight: 1.65,
                        marginBottom: '36px', maxWidth: '420px'
                    }}>
                        Orbit is a fast, clean, AI-assisted social platform built without ads,
                        algorithmic manipulation, or dark patterns. Just real conversations.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '13px 32px', borderRadius: '999px', fontSize: '15px',
                                fontWeight: 700, cursor: 'pointer', border: 'none',
                                background: 'linear-gradient(135deg, #0e7a5c, #0a5c45)',
                                color: '#fff', boxShadow: '0 4px 20px rgba(14,122,92,0.4)',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(14,122,92,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,122,92,0.4)'; }}
                        >
                            Start orbiting free →
                        </button>
                        <button
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                padding: '13px 28px', borderRadius: '999px', fontSize: '15px',
                                fontWeight: 600, cursor: 'pointer',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.04)', color: '#8b949e',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#e7e9ea'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        >
                            See features
                        </button>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '32px', marginTop: '48px' }}>
                        {[{ n: 100, s: '%', label: 'Ad-free' }, { n: 3, s: 'x', label: 'Faster replies' }, { n: 0, s: ' trackers', label: 'Zero tracking' }].map(({ n, s, label }) => (
                            <div key={label}>
                                <div style={{ fontSize: '26px', fontWeight: 800, color: '#0e7a5c', letterSpacing: '-1px' }}>
                                    <Counter target={n} suffix={s} />
                                </div>
                                <div style={{ fontSize: '12px', color: '#6e767d', marginTop: '2px' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — mock feed preview */}
                <div style={{ animation: 'slide-up 0.6s 0.15s ease both' }}>
                    <div style={{
                        background: 'rgba(22,27,34,0.9)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
                        animation: 'float 6s ease-in-out infinite'
                    }}>
                        {/* fake chrome bar */}
                        <div style={{
                            padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            {['#e05d5d', '#f0a732', '#57c14a'].map(c => (
                                <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
                            ))}
                            <div style={{
                                marginLeft: '8px', flex: 1, height: '22px', borderRadius: '6px',
                                background: 'rgba(255,255,255,0.05)', display: 'flex',
                                alignItems: 'center', paddingLeft: '10px'
                            }}>
                                <span style={{ fontSize: '11px', color: '#4a5568' }}>orbit.app / home</span>
                            </div>
                        </div>

                        {/* mock posts */}
                        {MOCK_POSTS.map((post, i) => (
                            <div
                                key={post.id}
                                onMouseEnter={() => setHoveredPost(post.id)}
                                onMouseLeave={() => setHoveredPost(null)}
                                style={{
                                    padding: '14px 16px',
                                    borderBottom: i < MOCK_POSTS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                    background: hoveredPost === post.id ? 'rgba(255,255,255,0.02)' : 'transparent',
                                    transition: 'background 0.2s', cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: 'rgba(14,122,92,0.15)',
                                        border: '1px solid rgba(14,122,92,0.3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '16px', flexShrink: 0
                                    }}>
                                        {post.avatar}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#e7e9ea' }}>{post.name}</span>
                                            <span style={{ fontSize: '12px', color: '#4a5568' }}>@{post.handle} · {post.time}</span>
                                            {post.ai && (
                                                <span className="ai-badge" style={{
                                                    fontSize: '10px', padding: '1px 7px', borderRadius: '999px',
                                                    border: '1px solid rgba(14,122,92,0.4)', color: '#0e7a5c',
                                                    fontWeight: 600, marginLeft: 'auto'
                                                }}>✦ AI</span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#8b949e', lineHeight: 1.5, margin: '0 0 8px' }}>
                                            {post.text}
                                        </p>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            {[['💬', post.comments], ['🤍', post.likes], ['🔖', '']].map(([ic, count], j) => (
                                                <span key={j} style={{ fontSize: '12px', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    {ic} {count}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features grid ── */}
            <section id="features" style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '12px' }}>
                        Everything you need,{' '}
                        <span style={{ color: '#0e7a5c' }}>nothing you don't</span>
                    </h2>
                    <p style={{ color: '#6e767d', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
                        Built with a clear philosophy: give users control, remove friction, add real value.
                    </p>
                </div>

                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px'
                }}>
                    {FEATURES.map((f, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '28px 24px',
                                background: 'rgba(22,27,34,0.7)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '16px',
                                transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                                cursor: 'default'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = `${f.color}44`;
                                e.currentTarget.style.boxShadow = `0 12px 32px ${f.color}18`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: `${f.color}18`, border: `1px solid ${f.color}33`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '18px', color: f.color, marginBottom: '16px'
                            }}>
                                {f.icon}
                            </div>
                            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: '#e7e9ea' }}>
                                {f.title}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#6e767d', lineHeight: 1.6 }}>
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Comparison table ── */}
            <section style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 32px 100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '10px' }}>
                        How Orbit stacks up
                    </h2>
                    <p style={{ color: '#6e767d', fontSize: '15px' }}>
                        We're not just another clone — here's what makes Orbit different.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(22,27,34,0.8)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '20px', overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr repeat(3, 120px)',
                        padding: '16px 24px',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                        background: 'rgba(0,0,0,0.2)'
                    }}>
                        <span style={{ fontSize: '12px', color: '#4a5568', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Feature</span>
                        {[['Orbit', '#0e7a5c'], ['X / Twitter', '#4a5568'], ['Threads', '#4a5568']].map(([label, color]) => (
                            <span key={label} style={{ fontSize: '13px', fontWeight: 700, color, textAlign: 'center' }}>{label}</span>
                        ))}
                    </div>

                    {COMPARE.map((row, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'grid', gridTemplateColumns: '1fr repeat(3, 120px)',
                                padding: '14px 24px', alignItems: 'center',
                                borderBottom: i < COMPARE.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'
                            }}
                        >
                            <span style={{ fontSize: '14px', color: '#8b949e' }}>{row.label}</span>
                            {[row.orbit, row.x, row.threads].map((val, j) => (
                                <div key={j} style={{ textAlign: 'center' }}>
                                    {val
                                        ? <span style={{ fontSize: '16px', color: j === 0 ? '#0e7a5c' : '#4a5568' }}>✓</span>
                                        : <span style={{ fontSize: '16px', color: '#2d333b' }}>✕</span>
                                    }
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{
                textAlign: 'center', padding: '80px 32px 120px',
                background: 'linear-gradient(to bottom, transparent, rgba(14,122,92,0.06), transparent)'
            }}>
                <h2 style={{ fontSize: '44px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '16px' }}>
                    Ready to join the orbit?
                </h2>
                <p style={{ color: '#6e767d', fontSize: '16px', marginBottom: '36px' }}>
                    Free forever. No credit card. No ads. No nonsense.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '15px 44px', borderRadius: '999px', fontSize: '16px',
                        fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: 'linear-gradient(135deg, #0e7a5c, #0a5c45)',
                        color: '#fff', boxShadow: '0 8px 32px rgba(14,122,92,0.45)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(14,122,92,0.55)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(14,122,92,0.45)'; }}
                >
                    Create your account →
                </button>
            </section>

            {/* ── Footer ── */}
            <footer style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                padding: '24px 32px', textAlign: 'center',
                color: '#2d333b', fontSize: '13px'
            }}>
                Built with ♥ by Sunil, Ramesh, Akaash, Arjun · Orbit © 2026
            </footer>
        </div>
    );
};

export default Hero;