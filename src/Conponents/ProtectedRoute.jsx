import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = parseInt(localStorage.getItem("isLoggedIn"), 10);
  if (user === 1) return <Outlet />;
  else return <Navigate to='/' />;
}
