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
        // TODO: Replace with actual API URL when ready
        // Currently points to a placeholder endpoint
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const hubUrl = `${baseUrl}/chathub`;
        
        this.connection = new HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => token || '',
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        return this.connection;
    }
}

export const chatHubService = ChatHubService.getInstance();
