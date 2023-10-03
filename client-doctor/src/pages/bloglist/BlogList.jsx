import { BlogListCard } from "@/components/cards/BlogListCard";
import { DoctorCreateBlogForm } from "@/components/forms/DoctorCreateBlogForm";
import { toast } from "@/components/ui/use-toast";
import { doctrListBlog } from "@/services/blogService";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import errorMessageCode from "@/utils/errorCode";
import { useCallback } from "react";
/**
 *Page will display the blogs created by current user
 * @returns list of the blogs created.
 */
export const BlogList = () => {
  const [blogList, setBlogList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

 
  /**
   * Function to get list of blogs created by the user
   * @param {number} pageNo
   */
  const getBlogList = useCallback(async (pageNo) => {
    try {
      const response = await doctrListBlog(pageNo);
      const res = response?.data?.blogs;
      pageNo === 1 ? setBlogList(res) : setBlogList([...blogList, ...res]);
      setCurrentPage(response?.data?.currentPage);
      setHasMore(response?.data?.hasNext);
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          errorMessageCode[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong.",
      });
    }
  },[blogList]);
  /**
   * Function to call the blog list with next page number and it is used in the infintiy scroll
   */
  const loadFunc = () => {
    getBlogList(currentPage + 1);
  };

   /** UseEffect to call bloglist function when page is loaded */
   useEffect(() => {
    getBlogList(1);
  }, [getBlogList]);
  return (
    <InfiniteScroll pageStart={0} loadMore={loadFunc} hasMore={hasMore}>
      <div className="bg-muted overflow-y-auto py-6 ">
        <div className="flex justify-between mx-6 ">
          <div className="text-2xl font-semibold">BLOGS</div>
          <DoctorCreateBlogForm getBlogList={getBlogList} />
        </div>

        <div className="flex flex-wrap mt-11 justify-center mb-5">
          {blogList?.length === 0 ? (
            <div className="text-2xl font-semibold w-96 h-96 grid place-content-center">
              No Records Found
            </div>
          ) : (
            blogList?.map((value) => {
              return (
                <BlogListCard
                  key={value.id}
                  blog={value}
                  getBlogList={getBlogList}
                />
              );
            })
          )}
        </div>
      </div>
    </InfiniteScroll>
  );
};
