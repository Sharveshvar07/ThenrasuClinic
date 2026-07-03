import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation();
  const stored = localStorage.getItem("clinicAuth");

  if (!stored) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    const auth = JSON.parse(stored);
    const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

    if (!allowedRoles.includes(auth.user?.role)) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
  } catch {
    localStorage.removeItem("clinicAuth");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
}
