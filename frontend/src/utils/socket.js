import { io } from 'socket.io-client';
import { BASE_URL } from './constant';

let socket;

export const connectSocket = (userId) => {
    if (socket?.connected) return socket;

    socket = io(BASE_URL, {
        query: { userId },
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        socket.emit('user:online', userId);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;