export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    activityType?: string;
}

export interface NotificationContextType {
    notifications: NotificationItem[];
    isConnected: boolean;
    hasUnread: boolean;
    markAllAsRead: () => void;
}