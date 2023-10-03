import { useCallback, useEffect, useState } from "react";
import { DoctorCard } from "../card/DoctorCard";
import { GeneralCard } from "../card/GeneralCard";
import { toast } from "@/components/ui/use-toast";
import errorMessage from "@/utils/errorCode";
import { getDoctorsList, getSpecialityList } from "@/services/hospitalService";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import PropTypes from "prop-types";

/**
 * Page displays the overview of a specific hospital
 * @param {*} hospitalId to get the details in the current page
 * @returns
 */
export const OverViewHospital = ({ hospitalId }) => {
  const [specialityList, setspecialityList] = useState([]);
  const [doctorList, setDoctorList] = useState([1]);

  /**
   * Function to get the list of the 5 specialities in a hospital
   */
  const getSpeciality = useCallback(async () => {
    try {
      if (!hospitalId) return;
      const response = await getSpecialityList(hospitalId, 1, 5);
      setspecialityList(response?.data?.items);
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
  }, [hospitalId]);

  /**
   * Function to get the list of the 5 doctors in a hospital
   */
  const getDoctorList = useCallback(async () => {
    try {
      if (!hospitalId) return;
      const response = await getDoctorsList(hospitalId, 1, 2, 5);
      setDoctorList(response?.data?.items);
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
  }, [hospitalId]);

  useEffect(() => {
    getSpeciality();
    getDoctorList();
  }, [getDoctorList, getSpeciality, hospitalId]);

  return (
    <div className="my-5">
      <div>
        <div className="ps-10 lg:ps-40 my-5">
          <h1 className="sm:text-4xl text-titleblue"> Our Doctors</h1>
        </div>
        <ScrollArea className="mx-6">
          <ScrollBar orientation="horizontal"></ScrollBar>
          <div className="flex gap-4 justify-center mb-5">
            {doctorList?.length === 0 && <h1>No Doctors found</h1>}
            {doctorList?.length > 0 &&
              doctorList?.map((data) => (
                <DoctorCard
                  key={data.id + data.name}
                  id={data?.id}
                  name={data?.name}
                  qualification={data?.qualification}
                  designation={data?.designation}
                  image={data?.imageKey}
                />
              ))}
          </div>
        </ScrollArea>
      </div>
      <div className="bg-[#093143] mb-[-20px] pt-6">
        <div className="ps-10 lg:ps-40 my-5 mb-16">
          <h1 className="sm:text-4xl text-white ">Our Specialities</h1>
        </div>
        <ScrollArea className="mx-6" >
          <ScrollBar orientation="horizontal"></ScrollBar>
          <div className="flex gap-4 justify-center mb-5">
            {specialityList?.length === 0 && (
              <h1 className="p-4">No Specialities found</h1>
            )}
            {specialityList?.length > 0 &&
              specialityList?.map((data) => (
                <GeneralCard
                  title={data?.specialtyName}
                  description={data?.description}
                  key={data?.id}
                  id={data?.id}
                />
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
OverViewHospital.propTypes = {
  hospitalId: PropTypes.any,
};
