import { useRouteError, useNavigate } from 'react-router-dom';
import logo from '../assets/logodesign2.png';

function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    const status = error?.status || 404;
    const is404 = status === 404;

    const title = is404
        ? "Lost in space"
        : `Something broke`;

    const message = is404
        ? "The page you're looking for doesn't exist or the URL is wrong."
        : error?.statusText || error?.message || "An unexpected error occurred.";

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0d1117',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: '#e7e9ea',
            padding: '32px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background orbs */}
            <div style={{
                position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                width: '500px', height: '500px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(14,122,92,0.08) 0%, transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none'
            }} />

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
                <img src={logo} alt="Orbit" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                <span style={{ fontWeight: 800, fontSize: '20px', color: '#0e7a5c', letterSpacing: '-0.5px' }}>
                    Orbit
                </span>
            </div>

            {/* Error code */}
            <div style={{
                fontSize: '120px', fontWeight: 900, lineHeight: 1,
                letterSpacing: '-6px', marginBottom: '12px',
                background: 'linear-gradient(135deg, rgba(14,122,92,0.4), rgba(14,122,92,0.1))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                userSelect: 'none'
            }}>
                {status}
            </div>

            {/* Orbit ring illustration */}
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 32px' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    border: '2px solid rgba(14,122,92,0.3)',
                    position: 'absolute', inset: 0,
                    animation: 'spin 8s linear infinite'
                }} />
                <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    border: '1px dashed rgba(14,122,92,0.2)',
                    position: 'absolute', top: '10px', left: '10px',
                    animation: 'spin 5s linear infinite reverse'
                }} />
                <div style={{
                    position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)',
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: '#0e7a5c', boxShadow: '0 0 12px rgba(14,122,92,0.8)'
                }} />
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px'
                }}>
                    🛸
                </div>
            </div>

            {/* Title + message */}
            <h1 style={{
                fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px',
                marginBottom: '10px', textAlign: 'center'
            }}>
                {title}
            </h1>
            <p style={{
                color: '#6e767d', fontSize: '15px', textAlign: 'center',
                maxWidth: '380px', lineHeight: 1.6, marginBottom: '36px'
            }}>
                {message}
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '10px 28px', borderRadius: '999px', fontSize: '14px',
                        fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: 'linear-gradient(135deg, #0e7a5c, #0a5c45)',
                        color: '#fff', boxShadow: '0 4px 16px rgba(14,122,92,0.35)',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                    ← Back to Home
                </button>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '10px 24px', borderRadius: '999px', fontSize: '14px',
                        fontWeight: 600, cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.04)', color: '#8b949e',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#e7e9ea'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                    Go back
                </button>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;800;900&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default ErrorBoundary;