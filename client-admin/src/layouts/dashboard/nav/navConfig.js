import React from "react";

// component

import SvgColor from "../../../core/svg-color/SvgColor";

const icon = (name) => (
  <SvgColor src={`/assets/nav_svg/${name}.svg`} sx={{ width: 1, height: 1 }} />
);
const userRole = localStorage.getItem("role");

const navConfig = [
  {
    title: "dashboard",
    path: "/home",
    icon: icon("ic_dashboard"),
  },
  {
    title: "Admin",
    path: "/admin",
    icon: icon("ic_admin"),
    userRole: "1",
  },
  {
    title: "Hospitals",
    path: "/hospital",
    icon: icon("ic_hospital"),
    userRole: "1",
  },
  {
    title: "Doctor",
    path: "/doctor",
    icon: icon("ic_doctor"),
  },
  {
    title: "User",
    path: "/user",
    icon: icon("ic_users"),
    userRole: "1",
  },
  {
    title: "Specialty",
    path: "/specialty",
    icon: icon("ic_specialty"),
  },
  {
    title: "Sub Specialty",
    path: "/subspecialty",
    icon: icon("ic_subspecialty"),
  },
  {
    title: "Appointment",
    path: "/booking",
    icon: icon("ic_booking"),
  },
  {
    title: "Package Management",
    path: "/package",
    icon: icon("ic_package"),
  },
  {
    title: "Blog Management",
    path: "/blog",
    icon: icon("ic_blog"),
  },
  {
    title: "Service Management",
    path: "/service",
    icon: icon("ic_services"),
    userRole: "1",
  },
  {
    title: "Facility Management",
    path: "/facility",
    icon: icon("ic_facility"),
    userRole: "1",
  },
  {
    title: "Leave Management",
    path: "/leave",
    icon: icon("ic_leave"),
  },
  {
    title: "Timeslot Management",
    path: "/timeslot",
    icon: icon("ic_timeSlot"),
  },
];

export default navConfig;
