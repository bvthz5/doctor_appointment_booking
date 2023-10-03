import { useEffect, useState } from "react";
import { DoctorCard } from "../card/DoctorCard";
import { getDoctorsList } from "@/services/hospitalService";
import { useLocation, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import { checkType } from "@/utils/checkType";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";

/**
 * The component for showing the doctor list
 * @returns a doctor list
 */
export const DoctorList = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * UseEffect to call getDoctorsList function for the first time when page loads
   */
  useEffect(() => {
    getAllDoctorsList(1);
  }, []);

  /**
   * Function to get allDoctorslist based on hospital,speciality,subspeciality
   * @param {number} page
   */
  const getAllDoctorsList = async (page) => {
    if (location?.state?.id) {
      const type = checkType(location?.state?.id);
      try {
        const response = await getDoctorsList(location?.state?.id, page, type);
        const res = response?.data?.items;
        page === 1
          ? setDoctorsList(response?.data?.items)
          : setDoctorsList([...doctorsList, ...res]);
        setCurrentPage(response?.data?.currentPage);
        setHasMore(response?.data?.hasNext);
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
    } else {
      navigate("/");
    }
  };

  /**
   * Function to call the doctors list with next page number and it is used in the infintiy scroll
   */
  const loadMore = () => {
    getAllDoctorsList(currentPage + 1);
  };
  return (
    <div>
      <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={hasMore}>
        <div className="mb-3">
          <div className="flex justify-start mx-6 my-6">
            <div className="text-xl font-semibold">Doctors</div>
          </div>
          <div className="w-full gap-4 flex justify-center flex-wrap">
            {doctorsList?.length === 0 ? (
              <h1>No Doctors found</h1>
            ) : (
              doctorsList.map((doctor) => {
                return (
                  <DoctorCard
                    id={doctor?.id}
                    key={doctor?.id}
                    name={doctor?.name}
                    qualification={doctor?.qualification}
                    designation={doctor?.designation}
                    image={doctor?.imageKey}
                  />
                );
              })
            )}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};
