import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { useAuth } from '@/providers/auth-provider';

export const ProtectedLayout = () => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <MainLayout>
            <Suspense
                fallback={
                    <div className="h-full w-full flex items-center justify-center">Loading...</div>
                }
            >
                <Outlet />
            </Suspense>
        </MainLayout>
    );
};
