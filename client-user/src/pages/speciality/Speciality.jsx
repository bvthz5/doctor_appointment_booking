import { TabSwitch } from "@/components/tabSwitch/TabSwitch";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHospitalDetailById } from "@/services/hospitalService";
import { toast } from "@/components/ui/use-toast";
import { ROUTES_NAME } from "@/utils/routeName";
import errorMessage from "@/utils/errorCode";
const IMAGE_URL=import.meta.env.VITE_IMAGE_URL;

/**
 * Page that displays the details of a speciality
 * @returns Speciality details page
 */
export const Speciality = () => {
  const [hospitalDetail, setHospitalDetail] = useState("");
  let location = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    let id = location?.state?.id;
    if (!id) return navigate(ROUTES_NAME?.homePage);

    /**
     * Function get hospital detail by passing id got from state of the current location
     */
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
      <img
        src={IMAGE_URL+hospitalDetail?.fileKey}
        alt="image of the hospital"
        className="h-[40vh] w-full object-cover"
      />
      <TabSwitch />
    </div>
  );
};
