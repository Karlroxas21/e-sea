import { useState, useEffect, useCallback } from 'react';
import { HubConnectionState } from '@microsoft/signalr';
import { chatHubService } from '../api/chatHub';
import { type ChatMessage } from '../types';

export const useChatHub = (activeUserId?: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initialize connection
        const connection = chatHubService.createConnection();

        const startConnection = async () => {
            try {
                await connection.start();
                setIsConnected(true);
                console.log('Connected to Chat Hub');
                
                // Example of joining a specific group or loading history if needed:
                // if (activeUserId) {
                //    await connection.invoke('JoinChat', activeUserId);
                // }
            } catch (err) {
                console.error('SignalR Connection Error: ', err);
            }
        };

        connection.on('ReceiveMessage', (message: ChatMessage) => {
            // Filter incoming messages by the active chat context if necessary
            // if (message.senderId === activeUserId || message.receiverId === activeUserId)
            setMessages((prev) => [...prev, message]);
        });

        // Event listeners for connection state
        connection.onreconnecting(() => setIsConnected(false));
        connection.onreconnected(() => setIsConnected(true));

        startConnection();

        return () => {
            connection.off('ReceiveMessage');
            if (connection.state === HubConnectionState.Connected) {
                connection.stop();
            }
        };
    }, [activeUserId]);

    const sendMessage = useCallback(async (content: string, receiverId?: string) => {
        const connection = chatHubService.getConnection();
        if (connection?.state === HubConnectionState.Connected) {
            try {
                // Adjust method name and payload structure as defined by the backend
                await connection.invoke('SendMessage', {
                    content,
                    receiverId
                });
                
                // Optimistic update could go here if needed:
                // setMessages(prev => [...prev, { id: Date.now().toString(), content, senderId: 'ME', createdAt: new Date().toISOString() }]);
            } catch (err) {
                console.error('Error sending message: ', err);
                throw err;
            }
        } else {
            console.error('No connection to server yet.');
        }
    }, []);

    return {
        messages,
        isConnected,
        sendMessage,
        setMessages, // expose if you want to clear/manage locally
    };
};
