import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { generateResult } from './services/ai.service.js';

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // allow all for dev
        }
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            return next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.user.email);

        const projectId = socket.handshake.query.projectId;
        if (projectId) {
            socket.join(projectId);
            console.log(`User ${socket.user.email} joined project room: ${projectId}`);
        }

        socket.on('project-message', async (data) => {
            // data typically contains { message: '...', sender: { ...user } }
            console.log('Message received:', data);

            // Broadcast message to everyone else in the project room
            socket.broadcast.to(projectId).emit('project-message', data);

            // Handle AI messages
            if (data.message && data.message.includes('@ai')) {
                try {
                    const prompt = data.message.replace('@ai', '').trim();
                    const aiResponse = await generateResult(prompt);

                    // Broadcast AI response to everyone in the room
                    io.to(projectId).emit('project-message', {
                        message: aiResponse,
                        sender: {
                            _id: 'ai',
                            email: 'AI'
                        }
                    });

                } catch (error) {
                    console.error('Error generating AI response:', error);
                    io.to(projectId).emit('project-message', {
                        message: JSON.stringify({ text: "Sorry, I encountered an error generating a response." }),
                        sender: {
                            _id: 'ai',
                            email: 'AI'
                        }
                    });
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user.email);
            if (projectId) {
                socket.leave(projectId);
            }
        });
    });

    return io;
};
