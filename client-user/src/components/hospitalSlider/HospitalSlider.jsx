import { useEffect, useState, useRef } from "react";
import { getAllHospitalList } from "@/services/hospitalService";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";
import { Button } from "../ui/button";
import { ArrowLeftIcon, ArrowRight, ArrowRightIcon } from "lucide-react";
import { HospitalCard } from "../card/HospitalCard";
import { ROUTES_NAME } from "@/utils/routeName";
import { NavLink, useNavigate } from "react-router-dom";
/**
 *
 * @returns the tab to display top hospitals
 */
export const HospitalSlider = () => {
  const [hospitalList, setHospitalList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef();

  useEffect(() => {
    getTopHospitals();
  }, []);
  /**
   * Function to get tophospitals
   */
  const getTopHospitals = async () => {
    try {
      setIsLoading(true);
      const response = await getAllHospitalList(1, "");
      const items = response?.data?.Items;
      setHospitalList(items);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
  return (
    <div className="w-full flex justify-end bg-white">
      <div className="w-[94%] py-10 max-md:py-7 max-md:w-[90%] me-4">
        <div className="w-full flex h-24 items-center pr-8 justify-between">
          <h1 className="text-titleblue text-4xl font-semibold  max-md:text-2xl max-sm:text-xlx">
            Top Hospitals
          </h1>
          <Button
            onClick={() => {
              navigate(ROUTES_NAME.hospitalList);
            }}
            className="bg-[#328090] text-white border border-[#328090]  hover:bg-[#328090]"
          >
            View All <ArrowRight />
          </Button>
        </div>

        <div>
          <div
            className="flex gap-16 justify-start max-w-full overflow-y-auto"
            ref={scrollRef}
          >
            {hospitalList?.length === 0 && !isLoading ? (
              <h1 className="h-32 text-2xl flex justify-center items-center text-textblue">
                No Hospitals found
              </h1>
            ) : (
              hospitalList?.map((data) => (
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
