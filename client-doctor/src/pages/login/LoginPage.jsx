import { DoctorAuthForm } from "../../components/forms/DoctorAuthForm";
import doctorImage from "../../assets/doctorLogin.svg";
import { useLocation } from "react-router-dom";
import { DoctorForgotPasswordForm } from "@/components/forms/DoctorForgotPasswordForm";
import { DoctorResetPasswordForm } from "@/components/forms/DoctorResetPasswordForm";
import { Toaster } from "@/components/ui/toaster";

/**
 *This is a common page for  doctor's login,forgot password and reset password forms, The page will display each forms based on the current url
 * @returns common page for authentication functions of doctor
 */
export const LoginPage = () => {
  let { pathname } = useLocation();
  pathname = pathname?.toLocaleLowerCase();
  return (
    <>
      <div className="lg:hidden flex justify-center">
        <img src={doctorImage} alt="Authentication" className="w-80" />
      </div>
      <div className="container relative  lg:h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10  dark:border-r lg:flex ">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Doctor Appointment
          </div>
          <img src={doctorImage} alt="Authentication" className="my-auto" />
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {pathname === "/login" && "LOGIN"}
                {pathname === "/forgot-password" && "FORGOT PASSWORD"}
                {pathname === "/reset-password" && "RESET PASSWORD"}
              </h1>
            </div>
            {pathname === "/login" && <DoctorAuthForm />}
            {pathname === "/forgot-password" && <DoctorForgotPasswordForm />}
            {pathname === "/reset-password" && <DoctorResetPasswordForm />}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};
