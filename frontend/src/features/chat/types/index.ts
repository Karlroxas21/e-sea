export interface ChatMessage {
    id: string;
    senderId: string;
    receiverId?: string;
    content: string;
    createdAt: string;
}

export interface Contact {
    id: string;
    name: string;
    status: 'Online' | 'Offline';
    lastMessage: string;
}
