import LoginPage from '@/features/auth/routes/Login';
import RegisterPage from '@/features/auth/routes/Register';
import { PublicLayout } from '@/components/layouts/PublicLayout';

export const publicRoutes = [
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
];
