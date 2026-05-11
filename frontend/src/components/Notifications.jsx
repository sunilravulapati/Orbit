import useNotificationStore from '../store/useNotificationStore';
import { useEffect } from 'react';

const Notifications = () => {
    const notifications = useNotificationStore((s) => s.notifications);
    const markAllRead = useNotificationStore((s) => s.markAllRead);

    useEffect(() => {
        markAllRead();
    }, []);

    const iconMap = {
        like: '❤️',
        comment: '💬',
        follow: '👤',
    };

    return (
        <div className='flex-1 border-r border-orbit-border min-h-screen'>
            <div className='sticky top-0 bg-orbit-bg/80 backdrop-blur px-4 py-3 border-b border-orbit-border'>
                <h2 className='font-bold text-lg'>Notifications</h2>
            </div>

            {notifications.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-64 text-orbit-muted'>
                    <p className='text-4xl mb-3'>🔔</p>
                    <p className='text-sm'>No notifications yet</p>
                </div>
            ) : (
                <div className='divide-y divide-orbit-border'>
                    {notifications.map((n, i) => (
                        <div key={i} className='flex items-start gap-3 px-4 py-3 hover:bg-orbit-card transition-colors'>
                            <span className='text-xl'>{iconMap[n.type] || '🔔'}</span>
                            <p className='text-sm text-orbit-text'>{n.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;