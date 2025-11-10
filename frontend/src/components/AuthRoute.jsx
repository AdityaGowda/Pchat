// components/AuthRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * @param {ReactNode} children - The route's content
 * @param {"public"|"protected"} type - Type of route
 */
export default function AuthRoute({ children, type }) {
  const { currentUser = null, loading = false } = useAuth();

  if (loading) return <div>Loading...</div>;

  // 🔐 Protected routes → block unauthenticated users
  if (type === "protected" && !currentUser) {
    return <Navigate to="/login" replace />;
  }
  console.log(currentUser, ";::::::::::::::::::::");
  // 🌐 Public routes → block authenticated users
  if (type === "public" && currentUser) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}
