import { TabSwitch } from "@/components/tabSwitch/TabSwitch";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getHospitalDetailById } from "@/services/hospitalService";
import { toast } from "@/components/ui/use-toast";
import errorMessage from "@/utils/errorCode";
import { ROUTES_NAME } from "@/utils/routeName";
const IMAGE_URL=import.meta.env.VITE_IMAGE_URL;

/**
 * The page that displays the details of a specific hospital
 * @returns Detail page of the hospital
 */
export const HospitalDetailPage = () => {
  const [hospitalDetail, setHospitalDetail] = useState("");
  let location = useLocation();
  let navigate = useNavigate();

  /**
   * on first render and on id from the location state change call the api and fetch the hospital details
   */
  useEffect(() => {
    let id = location?.state?.id;
    if (!id) return navigate(ROUTES_NAME?.homePage);

    const getHospitalDetail = async () => {
      try {
        const response = await getHospitalDetailById(id);
        setHospitalDetail(response?.data);
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
        navigate("/");
      }
    };
    getHospitalDetail();
  }, [location?.state?.id, navigate]);
  return (
    <div>
      <div className="relative">
        <img
          src={IMAGE_URL+hospitalDetail?.fileKey}
          alt="image of the hospital"
          className="h-[40vh] w-full object-cover bg-muted"
        />
        <p className="p-1 md:p-3 bg-gray-100 absolute bottom-1 md:bottom-5 px-5 md:text-2xl break-all">
          {hospitalDetail?.name?.toUpperCase()}
        </p>
      </div>
      <TabSwitch contactInfo={hospitalDetail} />
    </div>
  );
};
