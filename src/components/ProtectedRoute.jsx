import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component
 *
 * NOTE: Client-side routing protection is for User Experience (UX).
 * For actual data security, you MUST implement Firestore Security Rules
 * in your Firebase Console to prevent unauthorized database access.
 */
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated and has a stored email
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userEmail = localStorage.getItem("userEmail");

  if (!isAuthenticated || !userEmail) {
    // Redirect them to the login page if not fully logged in
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
