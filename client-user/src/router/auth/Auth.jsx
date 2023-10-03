import { ROUTES_NAME } from "@/utils/routeName";
import { useLocation, Navigate, Outlet } from "react-router-dom";

export const Auth = () => {
  const auth = localStorage.getItem("accessToken");

  const location = useLocation();
  let authRouteType;
  if (auth) {
    authRouteType = <Outlet />;
  } else {
    authRouteType = <Navigate to={ROUTES_NAME?.doctorAppointment} state={{ from: location }} replace />;
  }
  return authRouteType;
};
