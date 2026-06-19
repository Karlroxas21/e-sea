import { api } from '@/lib/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Principal, PaginatedResponse } from '../types';

type GetPrincipalsParams = {
    page?: number;
    pageSize?: number;
    search?: string;
};

export const getPrincipals = ({
    page = 1,
    pageSize = 10,
    search = '',
}: GetPrincipalsParams): Promise<PaginatedResponse<Principal>> => {
    return api.get('/principals', {
        params: { page, pageSize, ...(search && { search }) },
    });
};

export const usePrincipals = ({ search = '' }: { search?: string } = {}) => {
    return useInfiniteQuery({
        queryKey: ['principals', search],
        queryFn: ({ pageParam = 1 }) =>
            getPrincipals({ page: pageParam, search }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
    });
};
