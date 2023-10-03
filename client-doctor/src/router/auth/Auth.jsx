import { useLocation, Navigate, Outlet } from "react-router-dom";

export const Auth = ({ allowedRoles }) => {
  const auth = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  const location = useLocation();
  let authRouteType;
  if (allowedRoles?.includes(role)) {
    authRouteType = <Outlet />;
  } else {
    if (auth) {
      authRouteType = <Navigate to="/" state={{ from: location }} replace />;
    } else {
      authRouteType = (
        <Navigate to="/login" state={{ from: location }} replace />
      );
    }
  }
  return authRouteType;
};
