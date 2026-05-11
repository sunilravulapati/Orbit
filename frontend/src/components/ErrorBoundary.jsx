import { useRouteError, useNavigate } from 'react-router-dom';
import logo from '../assets/logodesign2.png';
import { useEffect, useState } from 'react';

/* ── Floating star particle ───────────────────────────── */
const Star = ({ style }) => (
    <div style={{
        position: 'absolute',
        borderRadius: '50%',
        background: 'white',
        animation: 'twinkle var(--dur, 3s) ease-in-out infinite',
        animationDelay: 'var(--delay, 0s)',
        opacity: 0,
        ...style,
    }} />
);

function ErrorBoundary() {
    const error    = useRouteError();
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    const status = error?.status || 404;
    const is404  = status === 404;
    const title  = is404 ? "Lost in orbit" : "Something broke";
    const message = is404
        ? "The page you're looking for has drifted into deep space."
        : error?.statusText || error?.message || "An unexpected error occurred.";

    /* deterministic star field */
    const stars = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 11) % 100}%`,
        top:  `${(i * 53 + 7)  % 100}%`,
        size: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
        dur:  `${2 + (i % 4)}s`,
        delay:`${(i * 0.3) % 3}s`,
    }));

    return (
        <div style={{
            minHeight: '100vh',
            background: '#080e16',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Sora', system-ui, sans-serif",
            color: '#e7e9ea',
            padding: '32px',
            position: 'relative',
            overflow: 'hidden',
        }}>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&display=swap');

                /* Stars */
                @keyframes twinkle {
                    0%,100% { opacity: 0;   transform: scale(1); }
                    50%      { opacity: 0.8; transform: scale(1.4); }
                }

                /* Orbit rings */
                @keyframes spin-cw  { to { transform: rotate(360deg); } }
                @keyframes spin-ccw { to { transform: rotate(-360deg); } }

                /* Planet bob */
                @keyframes bob {
                    0%,100% { transform: translateY(0); }
                    50%     { transform: translateY(-10px); }
                }

                /* Satellite orbit */
                @keyframes orbit-sat {
                    from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
                    to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
                }

                /* Comet */
                @keyframes comet {
                    0%   { transform: translateX(0) translateY(0); opacity: 1; }
                    100% { transform: translateX(-900px) translateY(400px); opacity: 0; }
                }

                /* Mount animations */
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* Glow pulse */
                @keyframes glow-pulse {
                    0%,100% { opacity: 0.5; }
                    50%     { opacity: 1; }
                }

                /* Number glitch */
                @keyframes glitch {
                    0%,100% { clip-path: inset(0 0 100% 0); }
                    10%     { clip-path: inset(30% 0 50% 0); transform: translateX(-4px); }
                    20%     { clip-path: inset(60% 0 20% 0); transform: translateX(4px); }
                    30%     { clip-path: inset(0 0 0 0); transform: translateX(0); }
                    90%     { clip-path: inset(0 0 0 0); }
                }

                .mount-1 { animation: fade-up 0.6s ease forwards; animation-delay: 0.05s; opacity: 0; }
                .mount-2 { animation: fade-up 0.6s ease forwards; animation-delay: 0.2s;  opacity: 0; }
                .mount-3 { animation: fade-up 0.6s ease forwards; animation-delay: 0.35s; opacity: 0; }
                .mount-4 { animation: fade-up 0.6s ease forwards; animation-delay: 0.5s;  opacity: 0; }
                .mount-5 { animation: fade-up 0.6s ease forwards; animation-delay: 0.65s; opacity: 0; }

                .eb-btn {
                    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
                }
                .eb-btn:hover { transform: translateY(-2px); }
                .eb-btn-primary:hover {
                    box-shadow: 0 8px 32px rgba(14,122,92,0.5) !important;
                }
                .eb-btn-secondary:hover {
                    border-color: rgba(255,255,255,0.25) !important;
                    color: #e7e9ea !important;
                }
            `}</style>

            {/* ── Star field ──────────────────────────────────────────── */}
            {stars.map(s => (
                <Star key={s.id} style={{
                    left: s.left, top: s.top,
                    width: s.size, height: s.size,
                    '--dur': s.dur, '--delay': s.delay,
                }} />
            ))}

            {/* ── Comet ───────────────────────────────────────────────── */}
            <div style={{
                position: 'absolute', top: '18%', right: '-80px',
                width: '180px', height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(14,122,92,0.9), white)',
                borderRadius: '2px',
                animation: 'comet 5s ease-in 1.2s infinite',
                opacity: 0,
            }} />
            <div style={{
                position: 'absolute', top: '55%', right: '-60px',
                width: '100px', height: '1.5px',
                background: 'linear-gradient(90deg, transparent, rgba(14,122,92,0.6), rgba(255,255,255,0.7))',
                borderRadius: '2px',
                animation: 'comet 7s ease-in 4s infinite',
                opacity: 0,
            }} />

            {/* ── Ambient glow orb ────────────────────────────────────── */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '500px', height: '500px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(14,122,92,0.10) 0%, transparent 70%)',
                filter: 'blur(40px)',
                animation: 'glow-pulse 4s ease-in-out infinite',
                pointerEvents: 'none',
            }} />

            {/* ── Logo ────────────────────────────────────────────────── */}
            <div className="mount-1" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '56px' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute', inset: '-6px', borderRadius: '50%',
                        border: '1.5px solid rgba(14,122,92,0.4)',
                        animation: 'spin-cw 6s linear infinite',
                    }} />
                    <img src={logo} alt="Orbit" style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        boxShadow: '0 0 20px rgba(14,122,92,0.5)',
                    }} />
                </div>
                <span style={{
                    fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px',
                    background: 'linear-gradient(135deg, #0e7a5c, #14b87e)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                    Orbit
                </span>
            </div>

            {/* ── Planet system illustration ───────────────────────────── */}
            <div className="mount-2" style={{ position: 'relative', width: '240px', height: '240px', marginBottom: '36px' }}>

                {/* Outer orbit ring */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '1.5px solid rgba(14,122,92,0.2)',
                    animation: 'spin-cw 12s linear infinite',
                }} />
                {/* Inner orbit ring */}
                <div style={{
                    position: 'absolute', inset: '30px', borderRadius: '50%',
                    border: '1px dashed rgba(14,122,92,0.15)',
                    animation: 'spin-ccw 8s linear infinite',
                }} />

                {/* Planet */}
                <div style={{
                    position: 'absolute', inset: '60px', borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #1a3a5c, #0d1b2a)',
                    boxShadow: '0 0 40px rgba(14,122,92,0.25), inset -10px -8px 20px rgba(0,0,0,0.6)',
                    animation: 'bob 4s ease-in-out infinite',
                }}>
                    {/* Planet ring */}
                    <div style={{
                        position: 'absolute',
                        top: '45%', left: '-30%', right: '-30%', height: '12px',
                        border: '1.5px solid rgba(14,122,92,0.4)',
                        borderRadius: '50%',
                        transform: 'rotateX(70deg)',
                    }} />
                    {/* Status text on planet */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '32px',
                    }}>
                        🛸
                    </div>
                </div>

                {/* Satellite */}
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    width: '12px', height: '12px',
                    marginTop: '-6px', marginLeft: '-6px',
                    animation: 'orbit-sat 4s linear infinite',
                }}>
                    <div style={{
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0e7a5c, #14b87e)',
                        boxShadow: '0 0 10px rgba(14,122,92,0.9)',
                    }} />
                </div>

                {/* Second satellite (slower, reversed) */}
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    width: '8px', height: '8px',
                    marginTop: '-4px', marginLeft: '-4px',
                    animation: 'orbit-sat 9s linear infinite reverse',
                }}>
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.6)',
                        boxShadow: '0 0 6px rgba(255,255,255,0.5)',
                    }} />
                </div>
            </div>

            {/* ── Status code ─────────────────────────────────────────── */}
            <div className="mount-3" style={{ position: 'relative', marginBottom: '8px' }}>
                <div style={{
                    fontSize: '100px', fontWeight: 900, lineHeight: 1,
                    letterSpacing: '-6px',
                    background: 'linear-gradient(135deg, rgba(14,122,92,0.7) 0%, rgba(14,122,92,0.2) 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    userSelect: 'none',
                    filter: 'drop-shadow(0 0 30px rgba(14,122,92,0.3))',
                }}>
                    {status}
                </div>
                {/* Glitch layer */}
                <div style={{
                    position: 'absolute', inset: 0,
                    fontSize: '100px', fontWeight: 900, lineHeight: 1,
                    letterSpacing: '-6px',
                    background: 'linear-gradient(135deg, rgba(14,200,120,0.3) 0%, transparent 60%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    animation: 'glitch 6s ease-in-out infinite',
                    userSelect: 'none',
                }}>
                    {status}
                </div>
            </div>

            {/* ── Title ───────────────────────────────────────────────── */}
            <div className="mount-3">
                <h1 style={{
                    fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px',
                    marginBottom: '10px', textAlign: 'center',
                    background: 'linear-gradient(135deg, #e7e9ea 60%, rgba(14,122,92,0.8))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                    {title}
                </h1>
            </div>

            {/* ── Message ─────────────────────────────────────────────── */}
            <div className="mount-4">
                <p style={{
                    color: '#6e767d', fontSize: '15px', textAlign: 'center',
                    maxWidth: '340px', lineHeight: 1.7, marginBottom: '40px',
                    letterSpacing: '0.01em',
                }}>
                    {message}
                </p>
            </div>

            {/* ── Actions ─────────────────────────────────────────────── */}
            <div className="mount-5" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    className="eb-btn eb-btn-primary"
                    onClick={() => navigate('/')}
                    style={{
                        padding: '11px 30px', borderRadius: '999px', fontSize: '14px',
                        fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: 'linear-gradient(135deg, #0e7a5c, #14b87e)',
                        color: '#fff',
                        boxShadow: '0 4px 20px rgba(14,122,92,0.4)',
                        fontFamily: 'Sora, sans-serif',
                        letterSpacing: '0.02em',
                    }}
                >
                    ← Back to Home
                </button>
                <button
                    className="eb-btn eb-btn-secondary"
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '11px 26px', borderRadius: '999px', fontSize: '14px',
                        fontWeight: 600, cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.04)', color: '#8b949e',
                        fontFamily: 'Sora, sans-serif',
                        letterSpacing: '0.02em',
                    }}
                >
                    Go back
                </button>
            </div>

            {/* ── Subtle bottom tag ───────────────────────────────────── */}
            <div className="mount-5" style={{ position: 'absolute', bottom: '20px', color: 'rgba(110,118,125,0.5)', fontSize: '12px', letterSpacing: '0.05em' }}>
                ORBIT · SOCIAL
            </div>
        </div>
    );
}

export default ErrorBoundary;