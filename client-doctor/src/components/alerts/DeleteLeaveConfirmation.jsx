import PropTypes from "prop-types";
import { Trash } from "lucide-react";
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
import { cancelLeave } from "@/services/doctorService";
import { Button } from "../ui/button";

export const DeleteLeaveConfirmation = ({ id, getLeaveList, page }) => {
  /**
   * Function to delete the blog. It will the blog of the given blogId.
   */
  const onDelete = async () => {
    try {
      await cancelLeave(id);
      getLeaveList(page);
      toast({
        variant: "success",
        description: "Leave cancelled successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    }
  };
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="ms-4 bg-red-700 border-[1px] border-white hover:bg-white hover:text-red-700  hover:border-red-700">
            Cancel
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel leave.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

DeleteLeaveConfirmation.propTypes = {
  getLeaveList: PropTypes.func,
  id: PropTypes.any,
  page: PropTypes.any,
};
