import { HospitalCard } from "@/components/card/HospitalCard";
import { toast } from "@/components/ui/use-toast";
import { useCallback, useEffect, useState } from "react";
import errorMessage from "@/utils/errorCode";
import { getAllHospitalList } from "@/services/hospitalService";
import { NavLink } from "react-router-dom";
import { ROUTES_NAME } from "@/utils/routeName";
import InfiniteScroll from "react-infinite-scroller";
import { Input } from "@/components/ui/input";

/**
 * Page that displays the list of all hospitals.
 * @returns hospitalist page
 */
export const HospitalList = () => {
  const [hospitalList, setHospitalList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  /**
   * Function to get list of the hospital by passing page no of the specific api and seachkey from search field as parameters
   */
  const getHospitalList = useCallback(async (pageNo, searchKey) => {
    try {
      const response = await getAllHospitalList(pageNo, searchKey);
      const items = response?.data?.Items;
      pageNo === 1
        ? setHospitalList(items)
        : setHospitalList((el) => [...el, ...items]);
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
  }, []);

  /**
   * UseEffect to call getHospital list when page loasds for the first time
   */
  useEffect(() => {
    getHospitalList(1);
  }, [getHospitalList]);

  /**
   * instead of calling api on change search field ,we debounce and search for better api calling
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      getHospitalList(1, searchValue);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [getHospitalList, searchValue]);

  /**
   *Function to set value from search field  to searchValue useState
   * @param {*} data from search field
   */
  const handleSearch = (data) => {
    setSearchValue(data?.target?.value);
  };

  /**
   * Function to work infinity scroll. In this function we call getHospitalList function by adding one to current page and searchvalue as parameters
   */
  const loadFunc = () => {
    getHospitalList(currentPage + 1, searchValue);
  };
  return (
    <InfiniteScroll pageStart={0} loadMore={loadFunc} hasMore={hasMore}>
      <div className="flex justify-between mx-6 my-6 max-sm:flex-col">
        <div className="text-xl font-semibold">HOSPITALS</div>
        <Input
          placeholder="Search Hospital"
          className="w-60 sm:ms-5 max-sm:mt-2"
          onChange={handleSearch}
          value={searchValue}
        />
      </div>
      {hospitalList?.length === 0 ? (
        <h1 className="p-4">No Hospital Data Available</h1>
      ) : (
        <div className="flex justify-center flex-wrap gap-16 my-6 mx-6">
          {hospitalList?.map((data) => (
            <NavLink
              to={ROUTES_NAME?.hospitalDetail}
              state={{ id: data?.id }}
              key={data?.id}
            >
              <HospitalCard
                name={data?.name}
                city={data?.city}
                image={data?.fileKey}
                phoneNo={data?.contactNo}
              />
            </NavLink>
          ))}
        </div>
      )}
    </InfiniteScroll>
  );
};
