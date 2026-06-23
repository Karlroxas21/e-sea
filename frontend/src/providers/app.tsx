import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './auth-provider';

const queryClient = new QueryClient();

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>{children}</Router>
            </AuthProvider>
        </QueryClientProvider>
    );
};
