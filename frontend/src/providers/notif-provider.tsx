import { type NotificationPayload, type NotificationContextType } from "@/features/notif/types";
import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";
import { useAuth } from "./auth-provider";
import { notificationHubService } from "@/features/notif/api/notif-hub";
import { HubConnectionState } from "@microsoft/signalr";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationPayload[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    // check auth
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            const connection = notificationHubService.getConnection();
            if (connection) {
                connection.stop();
            }
            setIsConnected(false);
            return;
        }
        const token = localStorage.getItem('authToken') || undefined;
        const connection = notificationHubService.createConnection(token);

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

        const handleReceiveNotification = (payload: NotificationPayload) => {
            setNotification((prev) => [payload, ...prev]);

            // Trigger UI Alert (toast notification, web notification)
            console.log('Notification received:', payload);
        };

        connection.on('ReceiveNotification', handleReceiveNotification);

        const handleReconnecting = () => setIsConnected(false);
        const handleReconnected = () => setIsConnected(true);

        connection.onreconnected(handleReconnecting);
        connection.onreconnected(handleReconnected);

        return () => {
            connection.off('ReceiveNotification', handleReceiveNotification);
        };
    }, [isAuthenticated]);

    return (
        <NotificationContext.Provider value={{ notification, isConnected }}>
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