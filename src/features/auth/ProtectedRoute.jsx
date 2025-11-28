// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children }) {

  if (user === null) {
    return <div>go to login</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // user exists → allow
  return children;
}
