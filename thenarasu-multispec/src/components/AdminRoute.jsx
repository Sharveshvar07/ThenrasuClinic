import { Navigate, useLocation } from "react-router-dom";

/**
 * AdminRoute — protects pages that require hospital/admin authentication.
 * Unauthenticated users are sent home (not to a public login page).
 */
export default function AdminRoute({ children }) {
  const location = useLocation();
  const stored = localStorage.getItem("clinicAuth");

  if (!stored) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  try {
    const auth = JSON.parse(stored);
    if (auth?.user?.role !== "hospital") {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
    return children;
  } catch {
    localStorage.removeItem("clinicAuth");
    return <Navigate to="/" replace state={{ from: location }} />;
  }
}
