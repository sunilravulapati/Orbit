import { useEffect } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../utils/socket';
import useUserStore from '../store/useUserStore';
import useNotificationStore from '../store/useNotificationStore';
import useTweetStore from '../store/useTweetStore';

const useSocket = () => {
    const user = useUserStore((state) => state.user);
    const setOnlineUsers = useUserStore((state) => state.setOnlineUsers);
    const addNotification = useNotificationStore((state) => state.addNotification);
    const addNewPost = useTweetStore((state) => state.addNewPost);

    useEffect(() => {
        if (!user?.userId) return;

        const socket = connectSocket(user.userId);

        // Online presence
        socket.on('users:online', (userIds) => {
            setOnlineUsers(userIds);
        });

        // Incoming notifications
        socket.on('notification:new', (notification) => {
            addNotification(notification);
        });

        // New post appears in feed live
        socket.on('post:new', (post) => {
            addNewPost(post);
        });

        return () => {
            // Don't fully disconnect on unmount, just remove listeners
            socket.off('users:online');
            socket.off('notification:new');
            socket.off('post:new');
        };
    }, [user?.userId, setOnlineUsers, addNotification, addNewPost]);
};

export default useSocket;