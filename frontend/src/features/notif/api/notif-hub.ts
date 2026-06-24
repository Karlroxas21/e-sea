import { HubConnectionBuilder, LogLevel, type HubConnection } from "@microsoft/signalr";

class NotificationHubService {
    private connection: HubConnection | null = null;
    private static instance: NotificationHubService;

    private constructor() { }

    public static getInstance(): NotificationHubService {
        if (!NotificationHubService.instance) {
            NotificationHubService.instance = new NotificationHubService();
        }

        return NotificationHubService.instance;
    }

    public createConnection(token?: string): HubConnection {
        if (this.connection) return this.connection;

        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5146/v1/api';
        let hubUrl = `${baseUrl}/notificationhub`;

        try {
            const parsedUrl = new URL(baseUrl);
            hubUrl = `${parsedUrl.origin}/notificationhub`;
        } catch {
            if (baseUrl.startsWith('/')) {
                hubUrl = '/notificationhub';
            }
        }

        this.connection = new HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => token || localStorage.getItem('authToken') || '',
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        return this.connection;
    }

    public getConnection(): HubConnection | null {
        return this.connection;
    }
}

export const notificationHubService = NotificationHubService.getInstance();