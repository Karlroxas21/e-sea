import { useState, useEffect, useCallback } from 'react';
import { HubConnectionState } from '@microsoft/signalr';
import { chatHubService } from '../api/chatHub';
import { type ChatMessage } from '../types';
import { api } from '@/lib/axios';
import type { Chat } from '../types/chat';

const getMyUserId = (): string | null => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        return payload.sub || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
    } catch (e) {
        console.error('Error decoding JWT token:', e);
        return null;
    }
};

export const useChatHub = (activeUserId?: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const myUserId = getMyUserId();

    // Fetch message history when activeUserId changes
    useEffect(() => {
        if (!activeUserId) {
            setMessages([]);
            return;
        }

        const fetchHistory = async () => {
            try {
                const data = await api.get<Chat[]>(`/chat/${activeUserId}`);
                const mappedMessages = data.map((msg: any) => ({
                    id: msg.id,
                    senderId: msg.senderId,
                    receiverId: msg.recipientId || msg.receiverId,
                    content: msg.content,
                    createdAt: msg.sentAt || msg.createdAt,
                }));
                setMessages(mappedMessages);
            } catch (err) {
                console.error('Error fetching chat history:', err);
            }
        };

        fetchHistory();
    }, [activeUserId]);

    // Establish and manage SignalR Connection
    useEffect(() => {
        const token = localStorage.getItem('authToken') || undefined;
        const connection = chatHubService.createConnection(token);

        const startConnection = async () => {
            if (connection.state === HubConnectionState.Disconnected) {
                try {
                    await connection.start();
                    setIsConnected(true);
                } catch (err) {
                    console.error('SignalR Connection Error: ', err);
                }
            } else if (connection.state === HubConnectionState.Connected) {
                setIsConnected(true);
            }
        };

        // Listen for new messages
        const handleReceiveMessage = (message: any) => {
            const mappedMessage: ChatMessage = {
                id: message.id,
                senderId: message.senderId,
                receiverId: message.receiverId,
                content: message.content,
                createdAt: message.createdAt,
            };

            // Only add message to current chat thread if it belongs to the active conversation
            if (
                activeUserId &&
                (mappedMessage.senderId === activeUserId || 
                 (mappedMessage.senderId === myUserId && mappedMessage.receiverId === activeUserId))
            ) {
                setMessages((prev) => {
                    if (prev.some((m) => m.id === mappedMessage.id)) return prev;
                    return [...prev, mappedMessage];
                });
            }
        };

        connection.on('ReceiveMessage', handleReceiveMessage);

        const handleReconnecting = () => setIsConnected(false);
        const handleReconnected = () => setIsConnected(true);

        connection.onreconnecting(handleReconnecting);
        connection.onreconnected(handleReconnected);

        startConnection();

        return () => {
            connection.off('ReceiveMessage', handleReceiveMessage);
        };
    }, [activeUserId, myUserId]);

    // Send message via SignalR (with HTTP fallback if connection is offline)
    const sendMessage = useCallback(async (content: string, receiverId?: string) => {
        if (!receiverId) return;

        const connection = chatHubService.getConnection();
        if (connection?.state === HubConnectionState.Connected) {
            try {
                await connection.invoke('SendMessage', {
                    content,
                    receiverId
                });
                return;
            } catch (err) {
                console.warn('SignalR send failed, falling back to HTTP POST:', err);
            }
        }

        // Fallback: Send via HTTP POST
        try {
            const response = await api.post<any>('/chat', {
                recipientId: receiverId,
                content
            });
            const mappedMessage: ChatMessage = {
                id: response.id,
                senderId: response.senderId,
                receiverId: response.receiverId,
                content: response.content,
                createdAt: response.createdAt,
            };
            setMessages((prev) => {
                if (prev.some((m) => m.id === mappedMessage.id)) return prev;
                return [...prev, mappedMessage];
            });
        } catch (err) {
            console.error('HTTP send failed:', err);
            throw err;
        }
    }, []);

    return {
        messages,
        isConnected,
        sendMessage,
        setMessages,
        myUserId,
    };
};
