import { Server } from 'socket.io';

let io;

// userId → socketId map
const onlineUsers = new Map();

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL?.replace(/\/$/, "") || 'http://localhost:5173',
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        // Client sends their userId right after connecting
        socket.on('user:online', (userId) => {
            onlineUsers.set(userId, socket.id);
            // Broadcast updated online list to everyone
            io.emit('users:online', Array.from(onlineUsers.keys()));
            console.log(`User ${userId} is online`);
        });

        socket.on('disconnect', () => {
            // Remove user from online map
            for (const [userId, sockId] of onlineUsers.entries()) {
                if (sockId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit('users:online', Array.from(onlineUsers.keys()));
            console.log('Socket disconnected:', socket.id);
        });
    });
};

// Call this from any controller to send a notification to a specific user
export const sendNotification = (toUserId, notification) => {
    const socketId = onlineUsers.get(toUserId);
    if (socketId && io) {
        io.to(socketId).emit('notification:new', notification);
    }
};

// Call this to broadcast a new post to everyone's feed
export const broadcastNewPost = (post) => {
    if (io) {
        io.emit('post:new', post);
    }
};

export const getIO = () => io;