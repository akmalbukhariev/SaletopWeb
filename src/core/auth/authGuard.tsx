import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/shared/constants/routes";
import { useNavigate } from "react-router";

interface AuthGuardProps {
  children: React.ReactNode;
}

function AuthGuard({ children }: AuthGuardProps) {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  if (!isAuth) {
    console.log("User is not authenticated, redirecting to login.");
    navigate(ROUTES.AUTH.LOGIN);
  }

  return <>{children}</>;
}

export default AuthGuard;
