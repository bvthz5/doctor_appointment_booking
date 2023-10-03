import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { BlogListCard } from "../card/BlogListCard";

export const BlogDetailview = ({ blog }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <BlogListCard blog={blog} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle className="flex justify-start text-2xl mb-8 text-titleblue">
            {blog?.title}
          </DialogTitle>
          <DialogDescription className="h-[60vh] break-words overflow-y-auto text-left text-lg">
            <pre className="whitespace-pre-wrap text-textblue">
              {blog?.content}
            </pre>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex">
            <img
              src={
                blog?.doctor?.imageKey
                  ? blog?.doctor?.imageKey
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              className="h-24 w-24 rounded-full mr-5 "
            />
            <div className="flex h-full flex-col gap-3 items-center">
              <span
                className="text-[15px] text-titleblue overflow-hidden line-clamp-1 max-h-8 w-[500px] font-semibold max-md:w-[200px] max-sm:w-[100px]"
                title={blog?.title}
              >
                {blog?.doctor?.name}
              </span>
              <span
                className="text-[15px] text-textblue  overflow-hidden line-clamp-1 max-h-8 w-[500px] font-semibold max-md:w-[200px] max-sm:w-[100px]"
                title={blog?.title}
              >
                {blog?.doctor?.qualification}
              </span>
              <span className="text-sm w-full  text-textblue flex justify-start">
                {new Date(blog?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

BlogDetailview.propTypes = {
  blog: PropTypes.any,
};
