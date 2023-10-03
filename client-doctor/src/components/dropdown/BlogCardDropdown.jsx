import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DoctorCreateBlogForm } from "../forms/DoctorCreateBlogForm";
import { DeleteBlogConfirmation } from "../alerts/DeleteBlogConfirmation";
import PropTypes from "prop-types";

/**
 * when selecting on the kebab icon on blog card this dropdown will be displayed
 * @param {*} blog id of blog and getBlogList for calling the blog list main page
 * @returns dropdown
 */
export const BlogCardDropdown = ({ blogId, getBlogList }) => {
  return (
    <DropdownMenu>
      <div className="w-full flex justify-end">
        <DropdownMenuTrigger asChild className="m-0">
          <Button className="border-none  text-black bg-transparent w-10 p-3 hover:bg-gray-200">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="mr-28 ">
        <DropdownMenuGroup>
          <DoctorCreateBlogForm
            blogId={blogId}
            edit={true}
            getBlogList={getBlogList}
          />
          <DeleteBlogConfirmation blogId={blogId} getBlogList={getBlogList} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

BlogCardDropdown.propTypes = {
  blogId: PropTypes.number,
  getBlogList: PropTypes.any,
};
