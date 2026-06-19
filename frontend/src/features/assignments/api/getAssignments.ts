import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Assignment, SeaTime } from '../types';

export const getAssignments = ({ status }: { status: string }): Promise<Assignment[]> => {
    return api.get('/assignments', { params: { status } }).then((data: any) => data.items || data);
};

export const useAssignments = ({ status }: { status: string }) => {
    return useQuery({
        queryKey: ['assignments', status],
        queryFn: () => getAssignments({ status }),
    });
};

export const getSeaTime = (): Promise<SeaTime> => {
    return api.get('/assignments/sea-time');
};

export const useSeaTime = () => {
    return useQuery({
        queryKey: ['sea-time'],
        queryFn: getSeaTime,
    });
};

// If stats are needed separately or from a specific endpoint
export const useAssignmentStats = () => {
    return useQuery({
        queryKey: ['assignment-stats'],
        queryFn: () => api.get('/assignments', { params: { status: 'CurrentlyOnboard' } }).then((data: any) => ({
            totalActive: data.totalActive || 0,
            totalUpcoming: data.totalUpcoming || 0,
            totalHistory: data.totalHistory || 0,
            all: data.all || 0,
        })),
    });
};
