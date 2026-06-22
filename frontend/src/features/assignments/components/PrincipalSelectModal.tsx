import { useState, useRef, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { SearchSelectModal } from '@/components/SearchSelectModal';
import { usePrincipals } from '../api/getPrincipals';
import type { Principal } from '../types';

type PrincipalSelectModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (principal: Principal) => void;
};

export const PrincipalSelectModal = ({
    open,
    onOpenChange,
    onSelect,
}: PrincipalSelectModalProps) => {
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
    } = usePrincipals({ search: debouncedSearch });

    const principals = data?.pages.flatMap((page) => page.items) ?? [];

    const handleSelect = (principal: Principal) => {
        onSelect(principal);
        onOpenChange(false);
    };

    return (
        <SearchSelectModal
            open={open}
            onOpenChange={onOpenChange}
            title="Select a principal"
            description="Search manning companies by name."
            searchPlaceholder="Search principals..."
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
            {principals.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Building2 className="h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm font-medium">No principals found</p>
                    <p className="text-xs">Try a different search term</p>
                </div>
            ) : (
                principals.map((principal) => (
                    <button
                        key={principal.id}
                        type="button"
                        onClick={() => handleSelect(principal)}
                        className="flex items-center gap-3 w-full px-5 py-3.5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <div className="bg-[#0a2547] h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate">
                                {principal.name}
                            </div>
                        </div>
                    </button>
                ))
            )}
        </SearchSelectModal>
    );
};
