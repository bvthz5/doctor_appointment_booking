import { useEffect, useState,useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { getDoctorDetailsById } from "@/services/hospitalService";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";
import { ROUTES_NAME } from "@/utils/routeName";

/**
 * Page that display the complete details of a doctor that user is selected.
 * @returns doctor details view
 */
export const DoctorView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctorDetails, setDoctorDetails] = useState({});

 

  /**
   * Function to get details of doctor by passing docotr's id.
   */
  const getDoctorById = useCallback(async () => {
    if (location?.state?.id) {
      try {
        const response = await getDoctorDetailsById(location?.state?.id);
        setDoctorDetails(response?.data);
             } catch (error) {
        toast({
          variant: "destructive",
          title:
            isNaN(error?.response?.data?.errorCode) &&
            "Uh oh! Something went wrong.",
          description:
            errorMessage[error?.response?.data?.errorCode] ||
            error?.response?.data?.message,
        });
      }
    }
  },[location?.state?.id]);
  /**
   * function to handle navigation to booking appointment page
   * @param {*} details of doctor
   */
  const handleNavigation = (details) => {
    localStorage.setItem("id", details?.id);
    localStorage.setItem("name", details?.name);
    navigate(ROUTES_NAME?.bookAppointment);
  };

  /**
   * To get docotr by adding 
   */
  useEffect(() => {
    getDoctorById();
  }, [getDoctorById]);
  return (
    <div className=" w-full  h-[calc(100vh-64px)] grid place-content-center ">
      <div className="flex fixed justify-start mx-6 my-6">
        <div className="text-2xl font-semibold">DOCTOR DETAILS</div>
      </div>
      <div className="flex  justify-between items-center max-sm:flex-col max-sm:items-start">
        <div>
          <img
            alt="Image of doctor"
            src={doctorDetails?.imageKey}
            className="h-96 w-96 object-contain max-sm:h-72 max-sm:w-72 "
          />
        </div>
        <div className="ms-16 max-sm:ms-3 ">
          {" "}
          <h1 className="mt-3 font-bold text-2xl">Dr. {doctorDetails?.name}</h1>
          <h1 className="text-xl mt-1">{doctorDetails?.qualification}</h1>
          <div className=" space-y-6 mt-4">
            <h1 className="text-xl">{doctorDetails?.designation}</h1>
            <h1 className="text-xl">
              {doctorDetails?.specialty?.specialtyName}
            </h1>
            <h1 className="text-xl">
              {doctorDetails?.subspecialty?.SubSpecialtyName}
            </h1>
            <h1 className="text-xl">
              Experience : {doctorDetails?.experience} Years
            </h1>
            <Button type="button" onClick={()=>handleNavigation(doctorDetails)}>
              BOOK AN APPOINMENT <ArrowRight className="ms-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
