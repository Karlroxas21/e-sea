import { type NotificationItem, type NotificationContextType } from "@/features/notif/types";
import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";
import { useAuth } from "./auth-provider";
import { chatHubService } from "@/features/chat/api/chatHub";
import { HubConnectionState } from "@microsoft/signalr";
import { showNotificationToast } from "@/features/notif/utils/toast";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [lastReadTimestamp, setLastReadTimestamp] = useState<string>(() => 
        localStorage.getItem('lastReadNotificationsTimestamp') || '1970-01-01T00:00:00.000Z'
    );

    // check auth
    const { isAuthenticated } = useAuth();


    // Handle SignalR
    useEffect(() => {
        if (!isAuthenticated) {
            const connection = chatHubService.getConnection();
            if (connection) {
                connection.stop();
            }
            setIsConnected(false);
            return;
        }
        const token = localStorage.getItem('authToken') || undefined;
        const connection = chatHubService.createConnection(token);

        const startConnection = async () => {
            if (connection.state === HubConnectionState.Disconnected) {
                try {
                    await connection.start();
                    setIsConnected(true);
                } catch (err) {
                    console.error('Notification Hub Connection Error ', err);
                }
            } else if (connection.state === HubConnectionState.Connected) {
                setIsConnected(true);
            }
        };

        const handleReceiveNotification = (payload: any) => {
            const newItem: NotificationItem = {
                id: payload.id || new Date().getTime().toString(),
                title: payload.title || payload.message || payload.type || 'Notification',
                description: payload.description || payload.content || (payload.data?.content) || '',
                createdAt: payload.createdAt || new Date().toISOString(),
                activityType: payload.activityType || payload.type || 'Notification'
            };
            setNotifications((prev) => [newItem, ...prev]);

            // Trigger UI Alert (toast notification, web notification)
            showNotificationToast(newItem.title, newItem.description);
            console.log('Notification received:', newItem);
        };

        connection.on('ReceiveNotification', handleReceiveNotification);

        const handleReconnecting = () => setIsConnected(false);
        const handleReconnected = () => setIsConnected(true);

        connection.onreconnecting(handleReconnecting);
        connection.onreconnected(handleReconnected);

        startConnection();

        return () => {
            connection.off('ReceiveNotification', handleReceiveNotification);
        };
    }, [isAuthenticated]);

    const hasUnread = notifications.some(item => 
        new Date(item.createdAt).getTime() > new Date(lastReadTimestamp).getTime()
    );

    const markAllAsRead = () => {
        const now = new Date().toISOString();
        localStorage.setItem('lastReadNotificationsTimestamp', now);
        setLastReadTimestamp(now);
    };

    return (
        <NotificationContext.Provider value={{ notifications, isConnected, hasUnread, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    )
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
