import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import errorMessage from "@/utils/errorCode";
import { getUserBookedList } from "@/services/hospitalService";
import { UserViewBookingTable } from "@/components/tables/UserViewBookingTable";

/**
 * it is the column name list for table
 */
const columns = [
  {
    accessorKey: "doctorName",
    header: "DOCTOR NAME",
  },
  {
    accessorKey: "date",
    header: "DATE",
  },
  {
    accessorKey: "time",
    header: "TIME",
  },
  {
    accessorKey: "hospitalName",
    header: "HOSPITAL NAME",
  },
  {
    accessorKey: "speciality",
    header: "SPECIALITY",
  },
  {
    accessorKey: "action",
    header: "ACTION",
  },
];

/**
 * page for showing the viewing the user booked list
 * @returns patient list page
 */
export const UserViewBooking = () => {
  const [data, setdata] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [pageNo, setpageNo] = useState(1);

  /**
   * function for getting the user Booked appointment list
   */
  const getUserBookedListForUser = useCallback(async (page) => {
    try {
      const response = await getUserBookedList(page);
      /**
       * destruction for easy access
       */
      const { data: { items = [], hasNext: hasNextFromApi = false } = {} } =
        response;
      const refactorData = items.map((userData) => ({
        doctorName: userData?.doctor?.name,
        time: userData?.timeslot?.timeSlot,
        date: new Date(userData?.date)?.toDateString() || "",
        speciality: userData?.doctor?.specialty?.specialtyName,
        hospitalName: userData?.doctor?.specialty?.hospital.name,
        action: { id: userData?.id, status: userData?.status },
        email: userData?.user?.email || "",
        specialityId: userData?.doctor?.specialty?.id,
        doctorId: userData?.doctorId,
        id: userData?.id,
      }));

      setHasNext(hasNextFromApi);
      setdata(refactorData);
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          errorMessage[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong.",
      });
    }
  }, []);

  /**
   * on first page render call the get user appointment booked list api and on pagNo change
   */
  useEffect(() => {
    getUserBookedListForUser(pageNo);
  }, [getUserBookedListForUser, pageNo]);

  return (
    <div className="mt-[10vh] sm:flex sm:justify-center">
      <div>
        <h1 className="ms-3 p-3 h-11 font-extrabold">USER BOOKING</h1>
        <UserViewBookingTable
          columns={columns}
          data={data}
          hasNext={hasNext}
          setpageNo={setpageNo}
          pageNo={pageNo}
          getUserBookedListForUser={getUserBookedListForUser}
        />
      </div>
    </div>
  );
};
