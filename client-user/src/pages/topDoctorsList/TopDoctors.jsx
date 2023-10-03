import { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { toast } from "@/components/ui/use-toast";
import {
  getAllHospitalList,
  getAllSpecialities,
  getAllTopDoctors,
} from "@/services/hospitalService";
import errorMessage from "@/utils/errorCode";
import { DoctorCard } from "@/components/card/DoctorCard";
import { DoctorDetailsCard } from "@/components/card/DoctorDetailsCard";
import { Button } from "@/components/ui/button";

export const TopDoctors = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hospitalList, setHospitalList] = useState([]);
  const [specialityList, setSpecilityList] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Function used to get the top 10 doctors
   */
  const getTopDoctors = useCallback(
    async (pageNo, specialityId, hospitalId) => {
      try {
        setIsLoading(true);
        const response = await getAllTopDoctors(
          pageNo,
          10,
          specialityId,
          hospitalId
        );
        const data = response?.data?.items;
        pageNo === 1
          ? setDoctorsList(data)
          : setDoctorsList([...doctorsList, ...data]);
        setCurrentPage(response?.data?.currentPage);
        setHasMore(response?.data?.hasNext);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title:
            isNaN(error?.response?.data?.errorCode) &&
            "Uh oh! Something went wrong.",
          description: errorMessage[error?.response?.data?.errorCode] || "",
        });
      }
    },
    [doctorsList]
  );
  /**
   * Function to get all hospitals list
   */
  const getAllHospitals = async () => {
    try {
      setIsLoading(true);
      const response = await getAllHospitalList(1, "", 100);
      const hospitalDetails = response?.data?.Items || [];
      setHospitalList(hospitalDetails);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getSpecialities = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSpecialities(1,100);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  /**
   * Function to work infinite scroll
   */
  const loadFunc = () => {
    getTopDoctors(currentPage + 1);
  };

  useEffect(() => {
    getTopDoctors(1);
    getAllHospitals();
    getSpecialities();
  }, []);
  return (
    <div>
      <div className="flex justify-between mx-6 my-6 max-sm:flex-col">
        <div className="text-xl font-semibold">TOP DOCTORS</div>
      </div>
      <div className="flex  justify-between ">
        <div className="bg-green-500 w-1/4 p-6">
          <div className="flex justify-between">
            <div className="text-2xl text-titleblue"> Filter</div>
            <Button>Clear All</Button>
          </div>
          <div className="mt-4 text-textblue">Hospitals</div>
          <div
            className="max-h-[40vh] bg-gray-600 overflow-y-auto"
            onChange={(e) => {
              setSelectedHospital(e.target?.value);
            }}
          >
            {hospitalList?.map((data) => {
              return (
                <div key={data?.id} className="flex-col mt-2">
                  <input
                    type="radio"
                    id={data?.id}
                    value={data?.id}
                    name="gender"
                  />{" "}
                  <label htmlFor={data?.id}>{data?.name}</label>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-3/4 bg-blue-600 flex justify-center">
          <InfiniteScroll pageStart={0} loadMore={loadFunc} hasMore={hasMore}>
            {!isLoading && doctorsList?.length === 0 ? (
              <h1 className="p-4">No Doctors Data Available</h1>
            ) : (
              <div className="flex-col  my-6 mx-6">
                {doctorsList?.map((data) => (
                  // <DoctorCard
                  //   key={data?.doctor?.id + data?.doctor?.name}
                  //   id={data?.doctor?.id}
                  //   name={data?.doctor?.name}
                  //   qualification={data?.doctor?.qualification}
                  //   designation={data?.doctor?.designation}
                  //   image={data?.doctor?.imageKey}
                  // />
                  <DoctorDetailsCard key={data?.id} />
                ))}
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};
