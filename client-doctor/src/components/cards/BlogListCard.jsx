import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BlogCardDropdown } from "../dropdown/BlogCardDropdown";
import { BlogDetailview } from "../view/BlogDetailview";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * The component for the blog card
 * @param {*} blogId of blog and getBlogList used to call the blog list in the main page
 * @returns blog card component
 */
export const BlogListCard = ({ blog, getBlogList }) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [opens, setOpen] = useState(false);
  const openModal = () => setIsDetailModalOpen(true);
  const closeModal = () => {
    setOpen(!opens);
  };

  useEffect(() => {
    setIsDetailModalOpen(false);
  }, [opens]);
  return (
    <Card className="w-[320px] h-[370x] m-4 cursor-pointer shadow-md hover:bg-gray-100/30">
      <BlogCardDropdown blogId={blog?.id} getBlogList={getBlogList} />
      <CardHeader
        className="flex  justify-between w-full pt-1"
        onClick={openModal}
      >
        <CardTitle className="text-lg">{blog?.title}</CardTitle>
      </CardHeader>
      <CardContent onClick={openModal}>
        <CardDescription className="h-[200px]  break-all   line-clamp-[10]">
          {blog?.content}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between" onClick={openModal}>
        <p className="text-[12px]">
          Posted on : {new Date(blog?.createdAt).toLocaleDateString()}
        </p>
      </CardFooter>
      <BlogDetailview
        open={isDetailModalOpen}
        closeModal={closeModal}
        blog={blog}
      />
    </Card>
  );
};

BlogListCard.propTypes = { blog: PropTypes.any, getBlogList: PropTypes.any };
