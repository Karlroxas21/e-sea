import * as React from 'react';
import { Search, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type SearchSelectModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    searchPlaceholder?: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    children: React.ReactNode;
    scrollRef?: React.RefObject<HTMLDivElement | null>;
    isLoading?: boolean;
    isFetchingNextPage?: boolean;
};

export const SearchSelectModal = ({
    open,
    onOpenChange,
    title,
    description,
    searchPlaceholder = 'Search...',
    searchValue,
    onSearchChange,
    children,
    scrollRef,
    isLoading = false,
    isFetchingNextPage = false,
}: SearchSelectModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
                <div className="p-6 pb-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            {title}
                        </DialogTitle>
                        {description && (
                            <DialogDescription className="text-sm text-slate-500">
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#0a2547]/20"
                        />
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="max-h-[400px] overflow-y-auto border-t border-slate-100"
                >
                    {isLoading ? (
                        <div className="p-4 space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3">
                                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {children}
                        </div>
                    )}

                    {isFetchingNextPage && (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        </div>
                    )}
                </div>

                <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <Button
                        variant="outline"
                        className="w-full font-semibold"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
