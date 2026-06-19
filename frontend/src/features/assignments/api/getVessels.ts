import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Vessel, PaginatedResponse } from '../types';

type GetVesselsParams = {
    page?: number;
    pageSize?: number;
    search?: string;
};

export const getVessels = ({
    page = 1,
    pageSize = 10,
    search = '',
}: GetVesselsParams): Promise<PaginatedResponse<Vessel>> => {
    return api.get('/vessels', {
        params: { page, pageSize, ...(search && { search }) },
    });
};

export const useVessels = ({ search = '' }: { search?: string } = {}) => {
    return useInfiniteQuery({
        queryKey: ['vessels', search],
        queryFn: ({ pageParam = 1 }) =>
            getVessels({ page: pageParam, search }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
    });
};
