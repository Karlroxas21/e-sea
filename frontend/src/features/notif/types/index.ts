export interface NotificationPayload {
    message: string;
    data: Data;
}

export interface Data {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: Date;
}

export interface NotificationContextType {
    notification: NotificationPayload[];
    isConnected: boolean;
}