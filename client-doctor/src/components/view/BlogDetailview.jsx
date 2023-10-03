import { X } from "lucide-react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const BlogDetailview = ({ open, closeModal, blog }) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogPrimitive.Close
          tabIndex={-1}
          onClick={() => {
            closeModal();
          }}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        <DialogHeader className="p-4">
          <DialogTitle className="flex justify-start text-2xl mb-8">
            {blog?.title}
          </DialogTitle>
          <DialogDescription className="h-[60vh] break-words overflow-y-auto text-left text-lg">
            <pre className="whitespace-pre-wrap ">{blog?.content}</pre>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <p className="text-sm w-full flex justify-start">
            Posted on : {new Date(blog?.createdAt).toLocaleDateString()}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

BlogDetailview.propTypes = {
  blog: PropTypes.any,
  closeModal: PropTypes.func,
  open: PropTypes.any,
};
