import { Navigate } from 'react-router-dom';
import Dashboard from '@/features/dashboard/routes/Dashboard';
import Assignments from '@/features/assignments/routes/Assignments';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import AddAssignment from '@/features/assignments/routes/AddAssignment';

export const protectedRoutes = [
    {
        element: <ProtectedLayout />,
        children: [
            { path: '/dashboard', element: <Dashboard /> },
            { 
                path: '/assignments',
                element: <Assignments />,
                children: [
                    {path: 'add', element: <AddAssignment />}
                ]
            },
            { path: '*', element: <Navigate to="/dashboard" /> },
        ],
    },
];
