import { Navigate } from 'react-router-dom';
import Dashboard from '@/features/dashboard/routes/Dashboard';
import Assignments from '@/features/assignments/routes/Assignments';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';

export const protectedRoutes = [
  {
    element: <ProtectedLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/assignments', element: <Assignments /> },
      { path: '*', element: <Navigate to="/dashboard" /> },
    ],
  },
];
