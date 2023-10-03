import { useEffect, useState } from "react";
import { GeneralCard } from "../card/GeneralCard";
import { getSpecialityList } from "@/services/hospitalService";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";
import InfiniteScroll from "react-infinite-scroller";
import PropTypes from "prop-types";

/**
 * List the specialities of a hospital.
 * @param {*} hospitalId of the hospital 
 * @returns 
 */
export const SpecialityList = ({ hospitalId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [specialiityList, setSpecialityList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    getAllSpecialityList(1);
  }, []);

  /**
   * Function to get all specialities of a specific hospital.
   * @param {number} pageNo  PageNo to pass through the api
   */
  const getAllSpecialityList = async (pageNo) => {
    try {
      const response = await getSpecialityList(hospitalId, pageNo, 10);

      const data = response?.data?.items;
      pageNo === 1
        ? setSpecialityList(response?.data?.items)
        : setSpecialityList([...specialiityList, ...data]);
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
  };

  /** Function  of infinity scrolll */
  const loadFunc = () => {
    getAllSpecialityList(currentPage + 1);
  };
  return (
    <>
      <InfiniteScroll pageStart={0} loadMore={loadFunc} hasMore={hasMore}>
        <div className="mb-3">
          <div className="flex justify-start mx-6 my-6">
            <div className="text-xl font-semibold">Speciality</div>
          </div>
          <div className="w-full gap-4 flex justify-center flex-wrap">
            {specialiityList?.map((value) => {
              return (
                <GeneralCard
                  id={value?.id}
                  title={value?.specialtyName}
                  description={value?.description}
                  key={value?.id}
                />
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

SpecialityList.propTypes = { hospitalId: PropTypes.number };
