import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/shared/constants/routes";
import { Navigate, useLocation } from "react-router";

interface AuthGuardProps {
  children: React.ReactNode;
}

function AuthGuard({ children }: AuthGuardProps) {
  const { isAuth } = useAuth();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default AuthGuard;
