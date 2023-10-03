import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layouts/Layout";
import { ErrorPage } from "@/pages/404/ErrorPage";
import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/pages/login/LoginPage";
import { Auth } from "./auth/Auth";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { MessagePage } from "@/pages/message/MessagePage";
import { BlogList } from "@/pages/bloglist/BlogList";
import { PatientList } from "@/pages/patientList/PatientList";
import { PatientHistory } from "@/pages/patientHistory/PatientHistory";
import { DoctorLeave } from "@/pages/doctorLeave/DoctorLeave";

const Routers = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Auth allowedRoles={[null]} />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<LoginPage />} />
            <Route path="/reset-password" element={<LoginPage />} />
          </Route>
          <Route element={<Auth allowedRoles={["doctor"]} />}>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/patient-list" element={<PatientList />} />
              <Route path="/patient-history" element={<PatientHistory />} />
              <Route path="/doctor-leave" element={<DoctorLeave />} />

            </Route>
          </Route>
          <Route path="/message" element={<MessagePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default Routers;
