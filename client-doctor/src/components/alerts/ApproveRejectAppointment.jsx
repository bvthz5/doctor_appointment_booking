import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { acceptRejectAppointment } from "@/services/doctorService";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";

/**
 * Confirmation dialog that popup when doctor needs approve/reject an appointment
 * @param {boolean} approve - used to determine which operation to be performed
 * @param {number} bookingId - id of the appoinment in which approve/reject eration to be performed
 * @param {any} getAllAppointments - Function to get the updated list of appointments when the approve/reject operation is completed
 * @returns  alert dialog
 */
export const ApproveRejectAppointment = ({
  approve = false,
  bookingId,
  getAllAppointments,
  pageNo,
  filter,
  date,
}) => {
  /**
   * Function to accept or reject the appointment for doctor.
   * accept/reject which operations needs to performed will be determined using the value of approve prop.
   * If the value of approve is true it will perform accept operation and else reject operation
   */
  const rejectAcceptAppointment = async () => {
    try {
      const confirmation = {
        type: approve ? 1 : 0,
      };
      await acceptRejectAppointment(bookingId, confirmation);
      toast({
        variant: "success",
        title: "",
        description: approve
          ? "Appointment accepted succefully"
          : "Appointment rejected succefully",
      });
      getAllAppointments(pageNo, date, filter);
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
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {approve ? (
          <Button className="ms-4 bg-green-800 border-[1px] border-white hover:bg-white hover:text-green-800  hover:border-green-800">
            Accept
          </Button>
        ) : (
          <Button className="ms-4 bg-red-700 border-[1px] border-white hover:bg-white hover:text-red-700  hover:border-red-700">
            Reject
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will {approve ? "accept " : "reject "} the appoinment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={rejectAcceptAppointment}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

ApproveRejectAppointment.propTypes = {
  approve: PropTypes.bool,
  bookingId: PropTypes.any,
  getAllAppointments: PropTypes.any,
  pageNo: PropTypes.any,
  date: PropTypes.any,
  filter: PropTypes.any,
};
