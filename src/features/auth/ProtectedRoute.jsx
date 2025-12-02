import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children }) {
  if (!user) {
    // أي حد مش مسجل دخول يروح login
    return <Navigate to="/login" replace />;
  }
  // لو موجود user → يسمح بالدخول
  return children;
}
