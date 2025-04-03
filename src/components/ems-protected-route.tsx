import { useEmsAuth } from '@/hooks/use-auth';
import React from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
};

const EmsProtectedRoute = ({ children, allowedRoles, redirectPath = "/ems/sign-in" }: Props) => {
  const { user } = useEmsAuth();
  console.log("EmsProtectedRoute", user, allowedRoles);
  if (!user || !allowedRoles.includes(user.user_role)) {
    return <Navigate to={redirectPath} />;
  }

  return <>{children}</>;
};

export default EmsProtectedRoute;