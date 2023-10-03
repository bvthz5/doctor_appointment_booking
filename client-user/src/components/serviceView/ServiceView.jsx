import { useCallback, useEffect, useState } from "react";
import { GeneralCard } from "../card/GeneralCard";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";
import { getAllService } from "@/services/hospitalService";
import InfiniteScroll from "react-infinite-scroller";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES_NAME } from "@/utils/routeName";

/**
 * Displays the list of service.Used in hospital,speciality,subspecilaity pages.
 * @returns service list
 */
export const ServiceView = () => {
  const [serviceList, setserviceList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Function get the servicelist based on hospital,speciality,subspecilaity.The value of type switches whether which url currently located
   */
  const getServiceList = useCallback(
    async (pageNo) => {
      try {
        let id = location?.state?.id;
        if (!id) return navigate(ROUTES_NAME?.homePage);

        const response = await getAllService(pageNo, id);
        const items = response?.data?.items;
        pageNo === 1
          ? setserviceList(items)
          : setserviceList((el) => [...el, ...items]);
        setCurrentPage(response?.data?.currentPage);
        setHasMore(response?.data?.HasNext);
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
    },
    [location?.state?.id, navigate]
  );

  useEffect(() => {
    getServiceList(1);
  }, [getServiceList]);

  /**
   * Functionto work inifinityscroll
   */
  const loadFunc = () => {
    getServiceList(currentPage + 1);
  };
  return (
    <InfiniteScroll pageStart={0} loadMore={loadFunc} hasMore={hasMore}>
      <div className="flex justify-start mx-6 my-6">
        <div className="text-xl font-semibold">SERVICES</div>
      </div>
      {serviceList?.length === 0 && (
        <h1 className="p-4">No Services Data Available</h1>
      )}
      {serviceList?.length > 0 && (
        <div className="flex justify-center flex-wrap gap-4 my-6 mx-6">
          {serviceList?.map((data) => (
            <GeneralCard
              key={data?.id}
              title={data?.serviceName}
              description={data?.description}
              type={false}
            />
          ))}
        </div>
      )}
    </InfiniteScroll>
  );
};
