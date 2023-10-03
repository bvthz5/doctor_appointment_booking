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
import { doctorDeleteBlog } from "@/services/blogService";
import { Trash } from "lucide-react";
import { toast } from "../ui/use-toast";
import PropTypes from "prop-types";

/**
 * The component used to show the delete confirmation
 * @param {*} blogId of blog and getBlogList used to call the blog list in the main page
 * @returns delete confirmation alert box
 */
export const DeleteBlogConfirmation = ({ blogId, getBlogList }) => {
  /**
   * Function to delete the blog. It will the blog of the given blogId.
  */
  const onDelete = async () => {
    try {
      await doctorDeleteBlog(blogId);
      getBlogList(1);
      toast({
        variant: "success",
        description: "Blog deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Blog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

DeleteBlogConfirmation.propTypes = {
  blogId: PropTypes.any,
  getBlogList: PropTypes.any,
};
