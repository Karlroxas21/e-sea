import { Navigate, Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};
