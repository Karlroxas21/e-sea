import { useState } from 'react';
import { Search, Bell, MessageSquare, HelpCircle, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAssignmentStore } from '@/features/assignments/store/useAssignmentStore';
import { useChatStore } from '@/features/chat/store/useChatStore';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useNotifications } from '@/providers/notif-provider';
import { formatDistanceToNow } from 'date-fns';

export function HeaderComponent() {
    const { isAddingAssignment } = useAssignmentStore();
    const { isChatOpen, setIsChatOpen, hasUnreadMessages } = useChatStore();
    
    const { notifications, hasUnread, markAllAsRead } = useNotifications();
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const handlePopoverChange = (open: boolean) => {
        setIsNotifOpen(open);
        if (open) {
            markAllAsRead();
        }
    };

    const getRelativeTime = (dateStr: string) => {
        try {
            return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
        } catch {
            return 'some time ago';
        }
    };

    return (
        <header className="flex h-16 shrink-0 items-center border-b border-slate-300 px-6 bg-white">
            <div className="flex w-full items-center justify-between gap-4">
                {isAddingAssignment ? (
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-slate-400">Assignment</span>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                        <span className="text-slate-900 font-bold">Add Assignment</span>
                    </div>
                ) : (
                    <div className="relative w-full max-w-sm search-bg rounded-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search across portal..."
                            className="w-full pl-9 h-9 bg-slate-50/50 border-slate-300"
                        />
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100 relative"
                    >
                        <MessageSquare className="h-[18px] w-[18px]" />
                        {hasUnreadMessages && (
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                    </Button>
                    
                    <Popover open={isNotifOpen} onOpenChange={handlePopoverChange}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100 relative cursor-pointer"
                            >
                                <Bell className="h-[18px] w-[18px]" />
                                {hasUnread && (
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 mr-4 shadow-lg border border-slate-200 bg-white rounded-xl" align="end">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <span className="font-bold text-sm text-slate-800">Notifications</span>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-slate-400">
                                        No notifications yet.
                                    </div>
                                ) : (
                                    notifications.map((item) => (
                                        <div key={item.id} className="p-3.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 flex gap-3 items-start transition-colors">
                                            <div className="h-7 w-7 rounded-full bg-purple-50 border border-purple-100/50 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
                                                <Bell className="h-3.5 w-3.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-xs font-semibold text-slate-900 leading-tight break-words">{item.title}</h5>
                                                <p className="text-xs text-slate-500 mt-1 leading-normal break-words">{item.description}</p>
                                                <span className="text-[10px] text-slate-400 mt-1.5 block">
                                                    {getRelativeTime(item.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100"
                    >
                        <HelpCircle className="h-[18px] w-[18px]" />
                    </Button>
                </div>
            </div>
        </header>
    );
}

