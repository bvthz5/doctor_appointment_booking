import React from "react";
import { Navigate, useRoutes } from "react-router-dom";

import DashboardLayout from "../layouts/dashboard/DashboardLayout";
import SimpleLayout from "../layouts/simple/SimpleLayout";
import Page404 from "../pages/page404/PageError";
import Home from "../pages/Dashboard/Dashboard";
import Admin from "../pages/Admin/Admin";
import User from "../pages/User/User";
import Hospital from "../pages/Hospitals/Hospital";
import Doctor from "../pages/Doctor/Doctor";
import Login from "../pages/login/Login";
import HostpitalDetail from "../components/detailView/HospitalDetail/HospitalDetail";
import DoctorDetailView from "../components/detailView/doctorDetail/DoctorDetailView";
import Specialty from "../pages/Specialty/Specialty";
import SubSpecialty from "../pages/SubSpecialty/SubSpecialty";
import AddHospital from "../components/forms/HospitalForm/AddHospital/HospitalAdd";
import Booking from "../pages/Booking/Booking";
import Package from "../pages/Package/Package";
import Blog from "../pages/Blog/Blog";
import BlogDetailView from "../components/detailView/BlogDetail/BlogDetailView";
import Services from "../pages/Services/Services";
import Facilities from "../pages/Facilities/Facilities";
import Timeslot from "../pages/Timeslot/Timeslot";

import Leave from "../pages/Leave/Leave";
import LeaveForm from "../components/forms/Leave/LeaveForm";
import ChangePassword from "../pages/ChangePassword/ChangePassword";

export default function Router() {
  const isAuthenticated = localStorage.getItem("accessToken");
  return useRoutes([
    {
      path: "/",
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/home" />, index: true },
        { path: "home", element: <Home /> },
        { path: "admin", element: <Admin /> },
        { path: "user", element: <User /> },
        { path: "hospital", element: <Hospital /> },
        { path: "hospitalDetail/:id", element: <HostpitalDetail /> },
        { path: "doctor", element: <Doctor /> },
        { path: "DoctorDetail/:id", element: <DoctorDetailView /> },
        { path: "specialty", element: <Specialty /> },
        { path: "subspecialty", element: <SubSpecialty /> },
        { path: "AddHospital", element: <AddHospital /> },
        { path: "EditHospital/:hospitalId", element: <AddHospital /> },
        { path: "Booking", element: <Booking /> },
        { path: "Package", element: <Package /> },
        { path: "Blog", element: <Blog /> },
        { path: "BlogDetail/:id", element: <BlogDetailView /> },
        { path: "Service", element: <Services /> },
        { path: "Facility", element: <Facilities /> },
        { path: "Timeslot", element: <Timeslot /> },
        { path: "Leave", element: <Leave /> },
        { path: "LeaveForm", element: <LeaveForm /> },
        { path: "EditLeave/:id", element: <LeaveForm /> },
        { path: "changePassword", element: <ChangePassword /> },


      ],
    },

    {
      path: "login",
      element: !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />,
    },

    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);
}
