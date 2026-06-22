import { useState } from 'react';
import { useChatStore } from '@/features/chat/store/useChatStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User, X, Minus, ChevronLeft, Search } from 'lucide-react';
import { useChatHub } from '../hooks/useChatHub';
import { type Contact } from '../types';

const DUMMY_CONTACTS: Contact[] = [
    { id: '1', name: 'Support Team', status: 'Online', lastMessage: 'How can we help you today?' },
    { id: '2', name: 'Capt. James Rogers', status: 'Offline', lastMessage: 'Please submit your documents.' },
    { id: '3', name: 'HR Department', status: 'Online', lastMessage: 'Your training is scheduled.' },
    { id: '4', name: 'Admin', status: 'Offline', lastMessage: 'System maintenance at 2 AM.' },
];

export const Chat = () => {
    const { isChatOpen, setIsChatOpen } = useChatStore();
    const [activeUser, setActiveUser] = useState<Contact | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageInput, setMessageInput] = useState('');
    
    // API Integration ready to use
    const { messages, isConnected, sendMessage } = useChatHub(activeUser?.id);

    if (!isChatOpen) return null;

    const filteredContacts = DUMMY_CONTACTS.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClose = () => {
        setIsChatOpen(false);
        // Optional: Reset active user when closed
        // setTimeout(() => setActiveUser(null), 300);
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[360px] h-[calc(100vh-8rem)] sm:h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 fade-in-20">
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
                            {filteredContacts.length === 0 ? (
                                <p className="text-xs text-center text-slate-500 py-6">No users found.</p>
                            ) : (
                                filteredContacts.map(contact => (
                                    <button 
                                        key={contact.id}
                                        onClick={() => setActiveUser(contact)}
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
                                                <span className="text-[10px] text-slate-400 shrink-0">1d</span>
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
                    <ScrollArea className="flex-1 p-4 bg-slate-50/50">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-2">
                                <Avatar className="w-6 h-6 shrink-0 mt-1">
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-[10px]">
                                        <User className="w-3 h-3" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                                    <p className="text-xs text-slate-700 leading-relaxed">{activeUser.lastMessage}</p>
                                    <span className="text-[9px] text-slate-400 mt-1 block">10:24 AM</span>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-2 flex-row-reverse">
                                <Avatar className="w-6 h-6 shrink-0 mt-1">
                                    <AvatarFallback className="bg-slate-800 text-white text-[10px]">
                                        ME
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-[#0B2545] text-white shadow-sm rounded-2xl rounded-tr-sm p-3 max-w-[85%]">
                                    <p className="text-xs leading-relaxed">yo</p>
                                    <span className="text-[9px] text-slate-300 mt-1 block text-right">10:25 AM</span>
                                </div>
                            </div>
                            
                            {/* Render live messages from SignalR */}
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === 'ME'; // Adjust depending on actual auth implementation
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
                        </div>
                    </ScrollArea>
                    
                    <div className="p-3 border-t border-slate-200 bg-white shrink-0">
                        <div className="flex items-center gap-2">
                            <Input 
                                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && messageInput.trim() && isConnected) {
                                        sendMessage(messageInput, activeUser.id);
                                        setMessageInput('');
                                    }
                                }}
                                disabled={!isConnected}
                                className="flex-1 bg-slate-50 border-slate-200 shadow-none rounded-full h-10 text-xs px-4 focus-visible:ring-1 focus-visible:ring-slate-400" 
                            />
                            <Button 
                                size="icon" 
                                disabled={!isConnected || !messageInput.trim()}
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