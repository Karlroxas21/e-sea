import { useState, useEffect, useCallback, useRef } from 'react';
import { useChatStore } from '@/features/chat/store/useChatStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User, X, Minus, ChevronLeft, ChevronDown, Search } from 'lucide-react';
import { useChatHub } from '../hooks/useChatHub';
import { type Contact } from '../types';
import { api } from '@/lib/axios';
import { chatHubService } from '../api/chatHub';
import type { ChatHistory, SearchUser } from '../types/chat';
import { HubConnectionState } from '@microsoft/signalr';

export const Chat = () => {
    const { 
        isChatOpen, 
        setIsChatOpen, 
        unreadCounts, 
        incrementUnreadCount, 
        clearUnreadCount 
    } = useChatStore();
    const [activeUser, setActiveUser] = useState<Contact | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [searchResults, setSearchResults] = useState<Contact[]>([]);
    const [showNewMessagesBadge, setShowNewMessagesBadge] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isSearching = searchQuery.trim().length > 0;

    // Clear unread counts for active chat partner
    useEffect(() => {
        if (isChatOpen && activeUser) {
            clearUnreadCount(activeUser.id);
        }
    }, [isChatOpen, activeUser?.id, clearUnreadCount]);
    
    const { messages, sendMessage, myUserId } = useChatHub(activeUser?.id);

    // Scroll helper methods
    const isAtBottom = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return true;
        return container.scrollHeight - container.scrollTop - container.clientHeight < 50;
    }, []);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
        setShowNewMessagesBadge(false);
    }, []);

    const handleScroll = useCallback(() => {
        if (isAtBottom()) {
            setShowNewMessagesBadge(false);
        }
    }, [isAtBottom]);

    // Scroll to bottom when conversation loads
    useEffect(() => {
        setShowNewMessagesBadge(false);
        setTimeout(() => scrollToBottom('auto'), 100);
    }, [activeUser?.id, scrollToBottom]);

    // Scroll to bottom or show new message badge when messages change
    useEffect(() => {
        if (messages.length === 0) return;
        const lastMessage = messages[messages.length - 1];
        const isFromMe = lastMessage.senderId === myUserId;

        if (isFromMe || isAtBottom()) {
            setTimeout(() => scrollToBottom('smooth'), 100);
        } else {
            setShowNewMessagesBadge(true);
        }
    }, [messages, myUserId, isAtBottom, scrollToBottom]);

    // Fetch active chats (history)
    const fetchHistory = useCallback(async () => {
        try {
            const history = await api.get<ChatHistory[]>('/chat');
            const mappedHistory = history.map(item => ({
                id: item.otherUserId,
                name: item.otherUserName,
                status: 'Online' as const,
                lastMessage: item.lastMessage
            }));
            setContacts(mappedHistory);
        } catch (err) {
            console.error('Failed to load chat history:', err);
        }
    }, []);

    // Fetch active chats (history) on load or when messages change
    useEffect(() => {
        fetchHistory();
    }, [messages, fetchHistory]);

    // SignalR real-time update for contact list and unread counts
    useEffect(() => {
        const token = localStorage.getItem('authToken') || undefined;
        const connection = chatHubService.createConnection(token);

        const handleGlobalReceive = (message: any) => {
            // Update the contact list in real time
            fetchHistory();

            // Increment unread count if message is from the other user and not currently active
            const isFromMe = message.senderId?.toLowerCase() === myUserId?.toLowerCase();
            const isChattingWithSender = isChatOpen && activeUser && activeUser.id?.toLowerCase() === message.senderId?.toLowerCase();
            if (!isFromMe && !isChattingWithSender) {
                incrementUnreadCount(message.senderId);
            }
        };

        const startAndListen = async () => {
            connection.on('ReceiveMessage', handleGlobalReceive);

            if (connection.state === HubConnectionState.Disconnected) {
                try {
                    await connection.start();
                } catch (e) {
                    console.error('Error starting global connection:', e);
                }
            }
        };

        startAndListen();

        return () => {
            connection.off('ReceiveMessage', handleGlobalReceive);
        };
    }, [isChatOpen, activeUser?.id, myUserId, fetchHistory, incrementUnreadCount]);

    // Search users in backend with debounce
    useEffect(() => {
        if (!isSearching) {
            setSearchResults([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                const results = await api.get<SearchUser[]>(`/chat/users?query=${encodeURIComponent(searchQuery)}`);
                const mappedResults = results.map(user => ({
                    id: user.id,
                    name: user.fullName,
                    status: 'Offline' as const,
                    lastMessage: user.email // Subtext in search results
                }));
                setSearchResults(mappedResults);
            } catch (err) {
                console.error('Failed to search users:', err);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, isSearching]);

    const handleClose = () => {
        setIsChatOpen(false);
        // Reset active user when closed
        // setTimeout(() => setActiveUser(null), 300);
    };

    const displayContacts = isSearching ? searchResults : contacts;

    return (
        <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[360px] h-[calc(100vh-8rem)] sm:h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 fade-in-20 ${!isChatOpen ? 'hidden' : ''}`}>
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-900 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    {activeUser ? (
                        <>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full -ml-2"
                                onClick={() => setActiveUser(null)}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Avatar className="w-8 h-8 shrink-0 border-2 border-white/20">
                                <AvatarFallback className="bg-slate-800 text-white text-[10px]">
                                    {activeUser.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-sm font-bold leading-tight">{activeUser.name}</h3>
                                <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${activeUser.status === 'Online' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                                    {activeUser.status}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div>
                            <h3 className="text-sm font-bold leading-tight">Messages</h3>
                            <p className="text-[10px] text-slate-300 mt-0.5">Select a contact to chat</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full"
                        onClick={handleClose}
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full"
                        onClick={handleClose}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {!activeUser ? (
                /* Contact List View */
                <>
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input 
                                placeholder="Search users..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 bg-white border-slate-200 text-xs shadow-none focus-visible:ring-1 focus-visible:ring-slate-400 rounded-full"
                            />
                        </div>
                    </div>
                    <ScrollArea className="flex-1 bg-white">
                        <div className="flex flex-col p-2">
                            {displayContacts.length === 0 ? (
                                <p className="text-xs text-center text-slate-500 py-6">No users found.</p>
                            ) : (
                                displayContacts.map(contact => (
                                    <button 
                                        key={contact.id}
                                        onClick={() => {
                                            setActiveUser(contact);
                                            clearUnreadCount(contact.id);
                                        }}
                                        className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
                                    >
                                        <Avatar className="w-10 h-10 shrink-0">
                                            <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-semibold">
                                                {contact.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="text-sm font-semibold text-slate-900 truncate">{contact.name}</h4>
                                                <div className="flex flex-col items-end shrink-0 gap-1">
                                                    <span className="text-[10px] text-slate-400">1d</span>
                                                    {unreadCounts[contact.id?.toLowerCase()] > 0 && (
                                                        <span className="bg-[#0B2545] text-white text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center animate-in scale-in-50">
                                                            {unreadCounts[contact.id?.toLowerCase()]}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </>
            ) : (
                /* Chat View */
                <>
                    <div className="flex-1 min-h-0 relative flex flex-col">
                        <div 
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 p-4 bg-slate-50/50 overflow-y-auto scrollbar-thin"
                        >
                            <div className="flex flex-col gap-4">
                                {messages.length === 0 && (
                                    <p className="text-xs text-center text-slate-400 py-10">No messages yet. Send a message to start the conversation.</p>
                                )}
                                
                                {/* Render live messages */}
                                {messages.map((msg, index) => {
                                    const isMe = msg.senderId === myUserId;
                                    return (
                                        <div key={msg.id || index} className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <Avatar className="w-6 h-6 shrink-0 mt-1">
                                                <AvatarFallback className={isMe ? 'bg-slate-800 text-white text-[10px]' : 'bg-blue-100 text-blue-600 text-[10px]'}>
                                                    {isMe ? 'ME' : <User className="w-3 h-3" />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className={`${isMe ? 'bg-[#0B2545] text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'} shadow-sm rounded-2xl p-3 max-w-[85%]`}>
                                                <p className="text-xs leading-relaxed">{msg.content}</p>
                                                <span className={`text-[9px] mt-1 block ${isMe ? 'text-slate-300 text-right' : 'text-slate-400'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        {showNewMessagesBadge && (
                            <button
                                onClick={() => scrollToBottom('smooth')}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0B2545] text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-[#1a385e] transition-all scale-100 active:scale-95 animate-in slide-in-from-bottom-2 fade-in z-10"
                            >
                                <ChevronDown className="w-4 h-4 animate-bounce" />
                                <span>New messages</span>
                            </button>
                        )}
                    </div>
                    
                    <div className="p-3 border-t border-slate-200 bg-white shrink-0">
                        <div className="flex items-center gap-2">
                            <Input 
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && messageInput.trim()) {
                                        sendMessage(messageInput, activeUser.id);
                                        setMessageInput('');
                                    }
                                }}
                                className="flex-1 bg-slate-50 border-slate-200 shadow-none rounded-full h-10 text-xs px-4 focus-visible:ring-1 focus-visible:ring-slate-400" 
                            />
                            <Button 
                                size="icon" 
                                disabled={!messageInput.trim()}
                                onClick={() => {
                                    if (messageInput.trim()) {
                                        sendMessage(messageInput, activeUser.id);
                                        setMessageInput('');
                                    }
                                }}
                                className="shrink-0 h-10 w-10 rounded-full bg-[#0B2545] hover:bg-[#1a385e] text-white shadow-sm disabled:opacity-50"
                            >
                                <Send className="w-4 h-4 -ml-0.5" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chat;