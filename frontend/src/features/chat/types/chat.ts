export type Chat = {
    seninderId: string;
    recipientId: string;
    content: string;
    sentAt: Date;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
};

export type ChatHistory = {
    otherUserId: string;
    otherUserName: string;
    lastMessage: string;
    sentAt: Date;
};

export type SearchUser = {
    id: string;
    fullName: string;
    email: string;
}