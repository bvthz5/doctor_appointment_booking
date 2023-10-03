import { useEffect, useState,useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import { getFacilityList } from "@/services/hospitalService";
import { checkType } from "@/utils/checkType";
import { GeneralCard } from "../card/GeneralCard";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";
/**
 * Displays the facilities that provided by a hospital.This page used in specility,subspeciality and hospitaldetails pages.The api parameters will change
 * based on current url pathname
 * @returns list of the facilities
 */
export const FacilityList = () => {
  const [facilityList, setFacilityList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Function to get allFacilityList based on hospital,speciality,subspeciality
   * @param {number} page  Page number that needs to pass through api used to fetch details
   */
  const getAllFacilityList = useCallback(
    async (page) => {
      if (location?.state?.id) {
        const type = checkType(location?.state?.id);
        try {
          const response = await getFacilityList(
            location?.state?.id,
            page,
            type
          );
          const res = response?.data?.items;
          page === 1
            ? setFacilityList(response?.data?.items)
            : setFacilityList([...facilityList, ...res]);
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
    },
    [facilityList, location?.state?.id, navigate]
  );

  /**
   *  Function to work infinity scroll. In this function we call getAllFacilityList function by adding one to current page as parameter
   */
  const loadMore = () => {
    getAllFacilityList(currentPage + 1);
  };
  /**
   * Useeffect to call getAllFacilityList function when the component is loaded for the first time
   */
  useEffect(() => {
    getAllFacilityList(1);
  }, [getAllFacilityList]);

  return (
    <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={hasMore}>
      <div className="flex justify-start mx-6 my-6">
        <div className="text-xl font-semibold">FACILITIES</div>
      </div>
      {facilityList?.length === 0 && (
        <h1 className="p-4">No Facilities Data Available</h1>
      )}
      {facilityList?.length > 0 && (
        <div className="flex justify-center flex-wrap gap-4 my-6 mx-6">
          {facilityList?.map((data) => (
            <GeneralCard
              key={data?.id}
              title={data?.facilityName}
              description={data?.description}
              type={false}
            />
          ))}
        </div>
      )}
    </InfiniteScroll>
  );
};
