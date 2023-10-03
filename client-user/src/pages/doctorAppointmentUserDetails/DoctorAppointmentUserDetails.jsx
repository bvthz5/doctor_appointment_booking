import { EmailForm } from "@/components/forms/EmailForm";
import { UserDetailsForm } from "@/components/forms/UserDetailsForm";
import { ROUTES_NAME } from "@/utils/routeName";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * this page is used for getting the user details
 * @returns page for geting users details
 */
export const DoctorAppointmentUserDetails = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  /**
   * if updatedFlag is enable then it redirect to booking appointment page
   */
  useEffect(() => {
    const update = localStorage.getItem("updateFlag");
    if (update == 0 && accessToken)
      return navigate(ROUTES_NAME?.bookAppointment);
    else if (!accessToken) {
      localStorage.removeItem("accessToken"),
      localStorage.removeItem("updateFlag")
    }
  }, [accessToken, navigate]);
  return (
    <>
      <h1 className="text-2xl  sm:text-3xl font-semibold m-7 mx-10 my-10">Add Details</h1>
      {emailVerified || accessToken ? (
        <UserDetailsForm userDetails={userDetails} />
      ) : (
        <EmailForm
          setEmailVerified={setEmailVerified}
          setUserDetails={setUserDetails}
        />
      )}
    </>
  );
};
