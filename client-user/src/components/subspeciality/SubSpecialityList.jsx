import { useLocation, useNavigate } from "react-router-dom";
import { GeneralCard } from "../card/GeneralCard";
import { getSubSpecialityList } from "@/services/hospitalService";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";
import { ROUTES_NAME } from "@/utils/routeName";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
/**
 * Displays the list sub specialities of a hospital
 * @returns subspecliaty list of a hospital
 */
export const SubSpecialityList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [subSpecialityList, setSubSpecialityList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * useEffect call get speciality function when page loaded for the first time
   */
  useEffect(() => {
    getAllSubSpeciality(1);
  }, []);

  /**
   *  Function to get all subspeciality by passing specific hospitalid or speciality Id of hosppital
   */
  const getAllSubSpeciality = async (page) => {
    /** As this tab in common for hospitalOverViewpage and specilityOverView page, we use pathname to determine the type that need to pass through api.  */
    const type = location.pathname === ROUTES_NAME.hospitalDetail ? 0 : 1;
    if (location?.state?.id) {
      try {
        const response = await getSubSpecialityList(
          location?.state?.id,
          type,
          page
        );
        const res = response?.data?.items;
        setCurrentPage(response?.data?.currentPage);
        page == 1
          ? setSubSpecialityList(response?.data?.items)
          : setSubSpecialityList([...subSpecialityList, ...res]);
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

  /** Function to work infinity scroll. In this function we call getAllSubSpeciality function by adding one to current page as parameter*/
  const loadMore = () => {
    getAllSubSpeciality(currentPage + 1);
  };
  return (
    <>
      <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={hasMore}>
        <div className="mb-3">
          <div className="flex justify-start mx-6 my-6">
            <div className="text-xl font-semibold">Sub Speciality</div>
          </div>
          <div className="w-full gap-4 flex justify-center flex-wrap">
            {subSpecialityList?.map((value) => {
              return (
                <GeneralCard
                  id={value?.id}
                  title={value?.SubSpecialtyName}
                  description={value?.description}
                  key={value}
                />
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};
