import { api } from '@/lib/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Position, PaginatedResponse } from '../types';

type GetPositionsParams = {
    page?: number;
    pageSize?: number;
    search?: string;
};

export const getPositions = ({
    page = 1,
    pageSize = 10,
    search = '',
}: GetPositionsParams): Promise<PaginatedResponse<Position>> => {
    return api.get('/positions', {
        params: { page, pageSize, ...(search && { search }) },
    });
};

export const usePositions = ({ search = '' }: { search?: string } = {}) => {
    return useInfiniteQuery({
        queryKey: ['positions', search],
        queryFn: ({ pageParam = 1 }) =>
            getPositions({ page: pageParam, search }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
    });
};
