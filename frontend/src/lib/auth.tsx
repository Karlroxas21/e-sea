import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
    complianceScore: number;
    currentStatus: string;
    nextAssignmentDate: string | null;
}

export interface AuthResponse extends AuthUser {
    jwt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    fullName: string;
}

export const AUTH_USER_QUERY_KEY = ['auth-user'];

export const getUser = async (): Promise<AuthUser | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        const data = await api.post<AuthResponse>('/auth/refresh');
        if (data && data.jwt) {
            localStorage.setItem('authToken', data.jwt);
            return {
                id: data.id,
                email: data.email,
                fullName: data.fullName,
                complianceScore: data.complianceScore,
                currentStatus: data.currentStatus,
                nextAssignmentDate: data.nextAssignmentDate,
            };
        }
        return data;
    } catch (error) {
        localStorage.removeItem('authToken');
        return null;
    }
};

export const useUser = () => {
    return useQuery({
        queryKey: AUTH_USER_QUERY_KEY,
        queryFn: getUser,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const data = await api.post<AuthResponse>('/auth/login', credentials);
            if (data && data.jwt) {
                localStorage.setItem('authToken', data.jwt);
            }
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(AUTH_USER_QUERY_KEY, {
                id: data.id,
                email: data.email,
                fullName: data.fullName,
                complianceScore: data.complianceScore,
                currentStatus: data.currentStatus,
                nextAssignmentDate: data.nextAssignmentDate,
            });
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async (credentials: RegisterCredentials) => {
            return api.post<void>('/auth/register', credentials);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            try {
                await api.post('/auth/logout');
            } finally {
                localStorage.removeItem('authToken');
                queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
            }
        },
        onSuccess: () => {
            queryClient.clear();
            window.location.href = '/';
        },
    });
};
