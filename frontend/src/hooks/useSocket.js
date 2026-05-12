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
        const handleOnlineUsers = (userIds) => {
            setOnlineUsers(userIds);
        };

        // Incoming notifications
        const handleNotification = (notification) => {
            addNotification(notification);
        };

        // New post appears in feed live
        const handleNewPost = (post) => {
            addNewPost(post);
        };

        socket.on('users:online', handleOnlineUsers);
        socket.on('notification:new', handleNotification);
        socket.on('post:new', handleNewPost);

        return () => {
            socket.off('users:online', handleOnlineUsers);
            socket.off('notification:new', handleNotification);
            socket.off('post:new', handleNewPost);
        };
    }, [user?.userId, setOnlineUsers, addNotification, addNewPost]);
};

export default useSocket;