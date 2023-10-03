import { DialogBox } from "@/components/dialogBox/DialogBox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { doctorGetProfile } from "@/services/doctorService";
import errorMessage from "@/utils/errorCode";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
/**
 * The page displayes the details of the currently logged in doctor
 * @returns profile page of the doctor
 */
export const ProfilePage = () => {
  const [doctorDetails, setDoctorDetails] = useState("");
  const [profileUpdated, setProfileUpdated] = useState(false);
  const navigate = useNavigate();

  const navigation = useNavigate();
  useEffect(() => {
    /**
     * Function to get the details of a currently logged in doctor.
     */
    const getDoctorProfile = async () => {
      try {
        const response = await doctorGetProfile();
        setDoctorDetails(response?.data);
      } catch (error) {
        toast({
          variant: "destructive",
          description:
            errorMessage[error?.response?.data?.errorCode] ||
            "Uh oh! Something went wrong.",
        });
        navigation("/");
      }
    };
    getDoctorProfile();
  }, [navigation, profileUpdated]);

  return (
    <div className="bg-muted pt-3 h-[calc(100vh-70px)] overflow-y-auto">
      <div className="flex justify-between mx-10 max-sm:mx-2  ">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <Button
          size="sm"
          className="text-[#328090] bg-transparent border border-[#328090] hover:bg-[#328090] hover:text-white"
          onClick={() => {
            navigate("/doctor-leave");
          }}
        >
          Leaves
        </Button>
      </div>
      <div className="flex justify-center">
        <div className="flex-col mt-10">
          <div className="flex justify-center">
            <div className="flex-col">
              <Avatar className="w-32 h-32 md:w-48 md:h-48 mx-auto border">
                <AvatarImage src={IMAGE_URL + doctorDetails?.imageKey} />
                <AvatarFallback className="bg-white">
                  <User className="w-12 h-12 " />
                </AvatarFallback>
              </Avatar>
              <div className="flex justify-center">
                <h1
                  className="font-extrabold  mt-3 text-xl max-sm:font-bold max-sm:text-sm max-sm:truncate max-sm:w-60"
                  title={doctorDetails?.name}
                >
                  {doctorDetails?.name?.toLocaleUpperCase()}
                </h1>
              </div>
              <div className="flex justify-center">
                <table className="text-lg mt-7 ">
                  <tbody>
                    <tr>
                      <td className="flex">Designation:</td>
                      <td className="ps-5">
                        <p className="w-60 break-words max-sm:w-36">
                          {doctorDetails?.designation}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>Experience:</td>
                      <td className="ps-5">
                        {doctorDetails?.experience} Years
                      </td>
                    </tr>
                    <tr>
                      <td className="flex">Qualification:</td>
                      <td className="ps-5">
                        <p className="w-60 break-words max-sm:w-36">
                          {doctorDetails?.qualification}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="flex">Email:</td>
                      <td className="ps-5">
                        <p className="w-60 break-all max-sm:w-36">
                          {doctorDetails?.email}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center">
                <DialogBox
                  name={doctorDetails?.name}
                  designation={doctorDetails?.designation}
                  experience={doctorDetails?.experience}
                  qualification={doctorDetails?.qualification}
                  image={doctorDetails?.imageKey}
                  version={doctorDetails?.version}
                  setProfileUpdated={setProfileUpdated}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
