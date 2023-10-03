import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import PropTypes from "prop-types";

/**
 * The component for the blog card
 * @param {*} blogId of blog and getBlogList used to call the blog list in the main page
 * @returns blog card component
 */
export const BlogListCard = ({ blog }) => {
  return (
    <Card className="w-[320px] h-[370x]  py-6 cursor-pointer shadow-md hover:bg-gray-100/30">
      <CardHeader className="flex  justify-between w-full pt-1">
        <CardTitle
          className="text-lg break-all line-clamp-2 max-h-14"
          title={blog?.title}
        >
          {blog?.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="h-[200px]  break-all   line-clamp-[10]">
          {blog?.content}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-start">
        <img
          src={
            blog?.doctor?.imageKey
              ? blog?.doctor?.imageKey
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          className="h-10 w-10 rounded-full mr-5 "
        />
        <div>
          <p
            className="text-[15px]  flex justify-start overflow-hidden line-clamp-1 max-h-8 w-[200px] font-semibold"
            title={blog?.title}
          >
            {blog?.doctor?.name}
          </p>
          <p className="text-[12px] mt-2 flex justify-start">
            {new Date(blog?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

BlogListCard.propTypes = { blog: PropTypes.any, getBlogList: PropTypes.any };
