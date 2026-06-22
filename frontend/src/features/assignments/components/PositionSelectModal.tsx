import { useState, useRef, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { SearchSelectModal } from '@/components/SearchSelectModal';
import { usePositions } from '../api/getPositions';
import type { Position } from '../types';

type PositionSelectModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (position: Position) => void;
};

export const PositionSelectModal = ({
    open,
    onOpenChange,
    onSelect,
}: PositionSelectModalProps) => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset search when modal closes
    useEffect(() => {
        if (!open) {
            setSearch('');
            setDebouncedSearch('');
        }
    }, [open]);

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = usePositions({ search: debouncedSearch });

    const positions = data?.pages.flatMap((page) => page.items) ?? [];

    const handleSelect = (position: Position) => {
        onSelect(position);
        onOpenChange(false);
    };

    return (
        <SearchSelectModal
            open={open}
            onOpenChange={onOpenChange}
            title="Select a position"
            description="Search available positions by title."
            searchPlaceholder="Search positions..."
            searchValue={search}
            onSearchChange={setSearch}
            scrollRef={scrollRef}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            onScrollBottom={() => {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }}
        >
            {positions.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Briefcase className="h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm font-medium">No positions found</p>
                    <p className="text-xs">Try a different search term</p>
                </div>
            ) : (
                positions.map((position) => (
                    <button
                        key={position.id}
                        type="button"
                        onClick={() => handleSelect(position)}
                        className="flex items-center gap-3 w-full px-5 py-3.5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <div className="bg-[#0a2547] h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
                            <Briefcase className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate">
                                {position.title}
                            </div>
                        </div>
                    </button>
                ))
            )}
        </SearchSelectModal>
    );
};
