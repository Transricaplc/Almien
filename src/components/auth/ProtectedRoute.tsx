import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRoles, type AppRole } from "@/hooks/useRoles";

export default function ProtectedRoute({
  children,
  requireAnyOfRoles,
}: {
  children: React.ReactElement;
  requireAnyOfRoles?: AppRole[];
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { data: roles, isLoading: rolesLoading } = useRoles(user?.id);

  if (loading || rolesLoading) return null;

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (requireAnyOfRoles?.length) {
    const ok = (roles ?? []).some((r) => requireAnyOfRoles.includes(r));
    if (!ok) return <Navigate to="/" replace />;
  }

  return children;
}
