import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './MainLayout';

export const ProtectedLayout = () => {
    const isAuthenticated = !!localStorage.getItem('authToken');
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
