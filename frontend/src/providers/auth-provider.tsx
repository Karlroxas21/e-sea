import { useUser, useLogin, useRegister, useLogout, type AuthUser, type LoginCredentials, type RegisterCredentials } from '@/lib/auth';
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<any>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading: isUserLoading } = useUser();
    const user = data ?? null;
    const loginMutation = useLogin();
    const registerMutation = useRegister();
    const logoutMutation = useLogout();

    const login = useCallback(
        async (credentials: LoginCredentials) => {
            return loginMutation.mutateAsync(credentials);
        },
        [loginMutation]
    );

    const register = useCallback(
        async (credentials: RegisterCredentials) => {
            return registerMutation.mutateAsync(credentials);
        },
        [registerMutation]
    );

    const logout = useCallback(
        async () => {
            return logoutMutation.mutateAsync();
        },
        [logoutMutation]
    );

    const isAuthenticated = !!user;
    const isLoading = isUserLoading;

    const value = useMemo(
        () => ({
            user,
            isAuthenticated,
            isLoading,
            login,
            register,
            logout,
        }),
        [user, isAuthenticated, isLoading, login, register, logout]
    );

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
                    <p className="text-sm font-medium text-slate-600">Loading session...</p>
                </div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};