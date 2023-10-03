import { DoctorLeaveForm } from "@/components/forms/DoctorLeaveForm";
import { DoctorLeaveTable } from "@/components/tables/DoctorLeaveTable";
import { toast } from "@/components/ui/use-toast";
import { allLeaves } from "@/services/doctorService";
import { useEffect, useState } from "react";
import errorMessage from "@/utils/errorCode";

export const DoctorLeave = () => {
  const [leaveList, setLeaveList] = useState([]);
  const [currenPage, setCurrentPage] = useState(1);
  const [hasMore, setHasmore] = useState(false);
  /**
   * Function to get the list of leaves by current user
   * @param {*} page
   */
  const getLeavelist = async (page) => {
    try {
      const response = await allLeaves(page);

      const data = response?.data?.Items.map((value) => {
        return {
          id: value?.id,
          startDate: value?.startDate,
          endDate: value?.endDate,
          timeSlot: value?.timeslot?.timeSlot,
        };
      });

      setLeaveList(data);
      setCurrentPage(response?.data?.currentPage);
      setHasmore(response?.data?.HasNext);
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

  useEffect(() => {
    getLeavelist(1);
  }, []);
  return (
    <div>
      <div className="mx-12 my-6 text-2xl font-bold max-md:mx-4">Leaves</div>
      <DoctorLeaveForm getLeavelist={getLeavelist} page={currenPage} />
      <div className="mx-12 my-6 text-2xl font-bold max-md:mx-4">My Leaves</div>
      <DoctorLeaveTable
        appointmentList={leaveList}
        currentPage={currenPage}
        hasMore={hasMore}
        getLeaveList={getLeavelist}
      />
    </div>
  );
};
