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
} from "../ui/alert-dialog";
import { toast } from "../ui/use-toast";
import { cancelUserBookingById } from "@/services/userService";
import errorMessage from "@/utils/errorCode";

/**
 *alert component for the cancel confirmation
 * @param {*} id - id of the user booking
 * @returns
 */
export const CancelUserBooking = ({ id,getUserBookedListForUser }) => {
  /**
   * function for canceling user booking
   */
  const handleSubmit = async () => {
    try {
      await cancelUserBookingById(id);
      toast({
        variant: "success",
        description: "Booking has been cancelled",
      });
      getUserBookedListForUser(1)
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          errorMessage[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong.",
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-4 rounded-sm max-w-sm ms-3 cursor-pointer"
      >
        <span className="text-white pt-2">Cancel</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently cancel your
            Booking.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

CancelUserBooking.propTypes = {
  getUserBookedListForUser: PropTypes.func,
  id: PropTypes.number
}
