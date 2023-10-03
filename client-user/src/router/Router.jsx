import { ErrorPage } from "@/pages/404/ErrorPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MessagePage } from "@/pages/message/MessagePage";
import { HomePage } from "@/pages/homePage/HomePage";
import Layout from "@/components/layouts/Layout";
import { HospitalDetailPage } from "@/pages/hospitalDetailPage/HospitalDetailPage";
import { Speciality } from "@/pages/speciality/Speciality";
import { ROUTES_NAME } from "@/utils/routeName";
import { HospitalList } from "@/pages/hospitalList/HospitalList";
import { SubSpeciality } from "@/pages/subSpeciality/SubSpeciality";
import { DoctorAppointmentUserDetails } from "@/pages/doctorAppointmentUserDetails/DoctorAppointmentUserDetails";
import { DoctorDetail } from "@/pages/doctorDetail/DoctorDetail";
import { BookAppointmentPage } from "@/pages/bookAppointmentPage/BookAppointmentPage";
import { Auth } from "./auth/Auth";
import { UserViewBooking } from "@/pages/userViewBooking/UserViewBooking";
import { TopDoctors } from "@/pages/topDoctorsList/TopDoctors";
import { BlogList } from "@/pages/bloglist/BlogLIst";
const Routers = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path={ROUTES_NAME?.homePage} element={<HomePage />} />
            <Route path={ROUTES_NAME?.hospitalDetail} element={<HospitalDetailPage />} />
            <Route path={ROUTES_NAME?.message} element={<MessagePage />} />
            <Route path={ROUTES_NAME?.speciality} element={<Speciality />} />
            <Route path={ROUTES_NAME?.hospitalList} element={<HospitalList />} />
            <Route path={ROUTES_NAME?.subSpeciality} element={<SubSpeciality />} />
            <Route path={ROUTES_NAME?.doctorAppointment} element={<DoctorAppointmentUserDetails />} />
            <Route path={ROUTES_NAME?.doctorDetailView} element={<DoctorDetail />} />
            <Route path={ROUTES_NAME?.blogList} element={<BlogList />} />
            <Route path={ROUTES_NAME?.topDocotors} element={<TopDoctors />} />
            

            <Route element={<Auth/>}>
              <Route path={ROUTES_NAME?.bookAppointment} element={<BookAppointmentPage />} />
              <Route path={ROUTES_NAME?.userViewBooking} element={<UserViewBooking />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default Routers;
