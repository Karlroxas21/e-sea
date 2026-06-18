import { useRoutes } from 'react-router-dom';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRouter = () => {
  const element = useRoutes([...publicRoutes, ...protectedRoutes]);

  return <>{element}</>;
};
