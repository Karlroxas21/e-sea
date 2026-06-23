import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

class ChatHubService {
    private connection: HubConnection | null = null;
    private static instance: ChatHubService;

    private constructor() {}

    public static getInstance(): ChatHubService {
        if (!ChatHubService.instance) {
            ChatHubService.instance = new ChatHubService();
        }
        return ChatHubService.instance;
    }

    public getConnection(): HubConnection | null {
        return this.connection;
    }

    public createConnection(token?: string) {
        if (this.connection) return this.connection;

        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5146/v1/api';
        let hubUrl = `${baseUrl}/chathub`;
        try {
            const parsedUrl = new URL(baseUrl);
            hubUrl = `${parsedUrl.origin}/chathub`;
        } catch {
            // Fallback to relative path if not absolute
            if (baseUrl.startsWith('/')) {
                hubUrl = '/chathub';
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
}

export const chatHubService = ChatHubService.getInstance();
