import { IoMdArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import useTweetStore from '../store/useTweetStore';
import Tweet from './Tweet';

const Bookmarks = () => {
    const bookmarks = useTweetStore((state) => state.bookmarks);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

                .bookmarks-root { font-family: 'Sora', sans-serif; }

                /* Header shimmer line */
                .bm-header-line {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(90deg,
                        transparent 0%,
                        rgba(14,122,92,0.4) 30%,
                        rgba(20,184,126,0.7) 50%,
                        rgba(14,122,92,0.4) 70%,
                        transparent 100%
                    );
                }

                /* Count badge pulse */
                @keyframes count-in {
                    from { opacity: 0; transform: scale(0.7) translateY(4px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                .count-badge {
                    animation: count-in 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
                }

                /* Empty state orbit animation */
                @keyframes spin-slow { to { transform: rotate(360deg); } }
                @keyframes spin-ccw  { to { transform: rotate(-360deg); } }
                @keyframes float-icon {
                    0%,100% { transform: translateY(0) scale(1); }
                    50%     { transform: translateY(-6px) scale(1.05); }
                }
                @keyframes glow-pulse {
                    0%,100% { opacity: 0.3; transform: scale(1); }
                    50%     { opacity: 0.7; transform: scale(1.1); }
                }

                .orbit-outer {
                    animation: spin-slow 10s linear infinite;
                }
                .orbit-inner {
                    animation: spin-ccw 6s linear infinite;
                }
                .orbit-icon {
                    animation: float-icon 3s ease-in-out infinite;
                }
                .orbit-glow {
                    animation: glow-pulse 3s ease-in-out infinite;
                }

                /* Empty state fade-in */
                @keyframes empty-fade {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .empty-fade { animation: empty-fade 0.6s ease forwards; }
                .empty-fade-2 { animation: empty-fade 0.6s ease 0.12s forwards; opacity: 0; }
                .empty-fade-3 { animation: empty-fade 0.6s ease 0.24s forwards; opacity: 0; }
                .empty-fade-4 { animation: empty-fade 0.6s ease 0.36s forwards; opacity: 0; }

                /* Tweet list entrance */
                @keyframes tweet-slide {
                    from { opacity: 0; transform: translateX(-8px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .tweet-slide {
                    animation: tweet-slide 0.3s ease forwards;
                    opacity: 0;
                }

                /* Browse button */
                .browse-btn {
                    position: relative; overflow: hidden;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .browse-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(14,122,92,0.4);
                }
                .browse-btn::after {
                    content: '';
                    position: absolute; inset: 0;
                    background: rgba(255,255,255,0.12);
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }
                .browse-btn:hover::after { transform: translateX(0); }

                /* Clear all btn */
                .clear-btn {
                    transition: color 0.2s, background 0.2s;
                }
                .clear-btn:hover {
                    color: #f87171;
                    background: rgba(248,113,113,0.08);
                }

                /* Separator dot */
                .sep-dot {
                    width: 3px; height: 3px; border-radius: 50%;
                    background: rgba(14,122,92,0.5);
                    display: inline-block;
                    margin: 0 6px;
                    vertical-align: middle;
                }
            `}</style>

            <div className='bookmarks-root w-[50%] border-l border-r border-orbit-border min-h-screen bg-orbit-bg'>

                {/* ── Header ──────────────────────────────────────────── */}
                <div className='relative flex items-center gap-3 py-3 px-4 bg-orbit-bg/95 backdrop-blur sticky top-0 z-10'>
                    <Link
                        to="/"
                        className='p-2 rounded-full hover:bg-orbit-surface transition-colors shrink-0'
                    >
                        <IoMdArrowBack size={20} className='text-orbit-text' />
                    </Link>

                    <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                            <h1
                                className='font-bold text-[17px] text-orbit-text leading-tight'
                                style={{ fontFamily: 'Sora, sans-serif' }}
                            >
                                Bookmarks
                            </h1>
                            {bookmarks.length > 0 && (
                                <span
                                    className='count-badge px-2 py-0.5 rounded-full text-[11px] font-bold text-orbit-teal border border-orbit-teal/30 bg-orbit-teal/8'
                                    style={{ background: 'rgba(14,122,92,0.08)' }}
                                >
                                    {bookmarks.length}
                                </span>
                            )}
                        </div>
                        <p className='text-orbit-muted text-[12px] mt-0.5'>
                            {bookmarks.length > 0
                                ? `${bookmarks.length} saved post${bookmarks.length !== 1 ? 's' : ''}`
                                : 'Your saved posts'}
                        </p>
                    </div>

                    {/* Teal underline shimmer */}
                    <div className='bm-header-line' />
                </div>

                {/* ── Empty state ──────────────────────────────────────── */}
                {bookmarks.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-24 px-8 text-center'>

                        {/* Orbit illustration */}
                        <div className='empty-fade relative w-32 h-32 mb-8'>

                            {/* Ambient glow */}
                            <div
                                className='orbit-glow absolute inset-0 rounded-full'
                                style={{
                                    background: 'radial-gradient(circle, rgba(14,122,92,0.15) 0%, transparent 70%)',
                                    filter: 'blur(8px)',
                                }}
                            />

                            {/* Outer ring */}
                            <div
                                className='orbit-outer absolute inset-0 rounded-full'
                                style={{ border: '1.5px solid rgba(14,122,92,0.25)' }}
                            >
                                {/* Ring dot */}
                                <div style={{
                                    position: 'absolute', top: '-5px', left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '10px', height: '10px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #0e7a5c, #14b87e)',
                                    boxShadow: '0 0 10px rgba(14,122,92,0.8)',
                                }} />
                            </div>

                            {/* Inner dashed ring */}
                            <div
                                className='orbit-inner absolute inset-4 rounded-full'
                                style={{ border: '1px dashed rgba(14,122,92,0.18)' }}
                            />

                            {/* Center icon */}
                            <div
                                className='orbit-icon absolute inset-8 rounded-full flex items-center justify-center'
                                style={{
                                    background: 'linear-gradient(135deg, rgba(14,122,92,0.12), rgba(26,58,92,0.2))',
                                    border: '1px solid rgba(14,122,92,0.2)',
                                }}
                            >
                                <BsBookmark size={22} className='text-orbit-teal' />
                            </div>
                        </div>

                        <h2
                            className='empty-fade-2 text-orbit-text font-bold text-xl mb-2 leading-tight'
                            style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                            Nothing saved yet
                        </h2>
                        <p className='empty-fade-3 text-orbit-muted text-[14px] leading-relaxed max-w-[260px] mb-8'>
                            Bookmark posts you want to revisit — they'll orbit right here.
                        </p>
                        <Link to="/" className='empty-fade-4'>
                            <button
                                className='browse-btn px-6 py-2.5 rounded-full text-[13px] font-bold text-white'
                                style={{
                                    background: 'linear-gradient(135deg, #0e7a5c, #14b87e)',
                                    boxShadow: '0 4px 16px rgba(14,122,92,0.35)',
                                    fontFamily: 'Sora, sans-serif',
                                }}
                            >
                                Explore posts
                            </button>
                        </Link>
                    </div>

                ) : (
                    /* ── Bookmark feed ─────────────────────────────────── */
                    <div className='pb-20'>
                        {bookmarks.map((tweet, i) => (
                            <div
                                key={tweet._id}
                                className='tweet-slide'
                                style={{ animationDelay: `${i * 40}ms` }}
                            >
                                <Tweet tweet={tweet} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Bookmarks;