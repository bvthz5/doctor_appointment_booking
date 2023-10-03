import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRight, ArrowRightIcon } from "lucide-react";
import { DoctorCard } from "../card/DoctorCard";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";
import { getAllTopDoctors } from "@/services/hospitalService";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ROUTES_NAME } from "@/utils/routeName";

export const DoctorSlider = () => {
  const [doctorList, setDoctorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef();
  const navigate = useNavigate();


  /**
   * Function used to get the top 10 doctors
   */
  const getTopDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await getAllTopDoctors(1);
      setDoctorList(response?.data?.items);
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
  };
  /**
   * To call fucnction to get top doctors when pge loaded for the first time 
   */
  useEffect(() => {
    getTopDoctors();
  }, []);
  return (
    <div className="w-full flex justify-end bg-bggreen">
      <div className="w-[94%] py-10 max-md:py-7 max-md:w-[90%] me-4">
        <div className="w-full flex h-24 items-center pr-8 justify-between">
          <h1 className="text-white text-4xl font-semibold  max-md:text-2xl max-sm:text-xlx">
            Top Doctors
          </h1>
          <Button
            onClick={() => {
              navigate(ROUTES_NAME?.topDocotors);
            }}
            className="bg-transparent text-white border border-white hover:bg-[#328090] hover:border-[#328090]"
          >
            View All <ArrowRight />
          </Button>
        </div>

        <div>
          <div
            className="flex gap-16 justify-start max-w-full overflow-y-auto "
            ref={scrollRef}
          >
            {doctorList?.length === 0 && !isLoading ? (
              <h1 className="h-32 text-2xl flex justify-center items-center text-textblue">
                No Doctors found
              </h1>
            ) : (
              doctorList?.map((data) => (
                <DoctorCard
                  key={data?.id }
                  id={data?.id}
                  name={data?.name}
                  qualification={data?.qualification}
                  designation={data?.designation}
                  image={data?.imageKey}
                />
              ))
            )}
          </div>
          <div className="flex gap-x-5 mt-4">
            <Button
              onClick={() => {
                scrollRef.current.scrollBy({
                  left: -360,
                  behavior: "smooth",
                });
              }}
            >
              <ArrowLeftIcon />
            </Button>
            <Button
              onClick={() => {
                scrollRef.current.scrollBy({
                  left: 360,
                  behavior: "smooth",
                });
              }}
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
