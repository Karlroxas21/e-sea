import { useState, useRef, useEffect } from 'react';
import { Anchor } from 'lucide-react';
import { SearchSelectModal } from '@/components/SearchSelectModal';
import { useVessels } from '../api/getVessels';
import type { Vessel } from '../types';

type VesselSelectModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (vessel: Vessel) => void;
};

export const VesselSelectModal = ({
    open,
    onOpenChange,
    onSelect,
}: VesselSelectModalProps) => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

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
    } = useVessels({ search: debouncedSearch });

    const vessels = data?.pages.flatMap((page) => page.items) ?? [];

    const handleSelect = (vessel: Vessel) => {
        onSelect(vessel);
        onOpenChange(false);
    };

    return (
        <SearchSelectModal
            open={open}
            onOpenChange={onOpenChange}
            title="Select a vessel"
            description="Search the fleet by name, type, or IMO number."
            searchPlaceholder="Search vessels..."
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
            {vessels.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Anchor className="h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm font-medium">No vessels found</p>
                    <p className="text-xs">Try a different search term</p>
                </div>
            ) : (
                vessels.map((vessel) => (
                    <button
                        key={vessel.id}
                        type="button"
                        onClick={() => handleSelect(vessel)}
                        className="flex items-center gap-3 w-full px-5 py-3.5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <div className="bg-[#0a2547] h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
                            <Anchor className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate">
                                {vessel.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                                IMO {vessel.imoNumber} · {vessel.type}
                            </div>
                        </div>
                        {vessel.flag && (
                            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                                {vessel.flag}
                            </span>
                        )}
                    </button>
                ))
            )}

        </SearchSelectModal>
    );
};
