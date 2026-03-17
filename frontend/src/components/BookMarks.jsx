import { IoMdArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { CiBookmark } from "react-icons/ci";
import useTweetStore from '../store/useTweetStore';
import Tweet from './Tweet';

const Bookmarks = () => {
    const bookmarks = useTweetStore((state) => state.bookmarks);

    return (
        <div className='w-[50%] border-l border-r border-orbit-border min-h-screen'>

            {/* Header */}
            <div className='flex items-center py-2 px-3 border-b border-orbit-border bg-orbit-bg sticky top-0 z-10'>
                <Link to="/" className='p-2 rounded-full hover:bg-orbit-card cursor-pointer'>
                    <IoMdArrowBack size="24px" className='text-orbit-text' />
                </Link>
                <div className='ml-2'>
                    <h1 className='font-semibold text-orbit-text'>Bookmarks</h1>
                    <p className='text-orbit-faint text-xs'>Saved posts</p>
                </div>
            </div>

            {/* Content */}
            {bookmarks.length === 0 ? (
                <div className='flex flex-col items-center justify-center mt-24 px-8 text-center'>
                    <div className='w-16 h-16 rounded-full bg-orbit-card border border-orbit-border flex items-center justify-center mb-4'>
                        <CiBookmark size="32px" className='text-orbit-teal' />
                    </div>
                    <h2 className='text-orbit-text font-semibold text-xl mb-2'>No bookmarks yet</h2>
                    <p className='text-orbit-muted text-sm leading-relaxed'>
                        Save posts you want to come back to. They'll show up here.
                    </p>
                    <Link to="/">
                        <button className='mt-6 px-6 py-2 bg-orbit-teal-dark hover:bg-orbit-teal hover:text-orbit-bg text-white rounded-full text-sm font-medium transition-colors'>
                            Browse posts
                        </button>
                    </Link>
                </div>
            ) : (
                // 👇 Reuse the Tweet component — bookmark toggle works here too
                bookmarks.map((tweet) => (
                    <Tweet key={tweet._id} tweet={tweet} />
                ))
            )}
        </div>
    );
};

export default Bookmarks;