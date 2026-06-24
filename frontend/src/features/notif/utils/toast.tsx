import { toast } from 'sonner';
import { Bell } from 'lucide-react';

export const showNotificationToast = (title: string, description: string) => {
    toast.custom((t) => (
        <div className="flex gap-3 items-start bg-white border border-slate-200 p-4 rounded-xl shadow-lg w-125 pointer-events-auto">
            <div className="h-8 w-8 rounded-full bg-purple-50 border border-purple-100/50 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
                <Bell className="h-4 w-4 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
                <h5 className="text-xs font-semibold text-slate-900 leading-tight">{title}</h5>
                <p className="text-xs text-slate-500 mt-1 leading-normal">{description}</p>
            </div>
            <button
                onClick={() => toast.dismiss(t)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold self-start cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
            >
                ✕
            </button>
        </div>
    ), {
        duration: 6000,
        unstyled: true,
        className: '!bg-transparent !border-0 !shadow-none',
    });
};
