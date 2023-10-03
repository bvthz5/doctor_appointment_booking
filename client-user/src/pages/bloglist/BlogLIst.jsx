import { BlogDetailview } from "@/components/blogSlider/BlogDetailview";
import { toast } from "@/components/ui/use-toast";
import { getBlogAll } from "@/services/hospitalService";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import errorMessage from "@/utils/errorCode";

/**
 *Page will display the blogs created by current user
 * @returns list of the blogs created.
 */
export const BlogList = () => {
  const [blogList, setBlogList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  /** UseEffect to call bloglist function when page is loaded */
  useEffect(() => {
    getBlogList(1);
  }, []);

  /**
   * Function to get list of blogs created by the user
   * @param {number} pageNo
   */
  const getBlogList = async (pageNo) => {
    try {
      const response = await getBlogAll(pageNo);
      const res = response?.data?.items;
      pageNo === 1 ? setBlogList(res) : setBlogList([...blogList, ...res]);
      setCurrentPage(response?.data?.pagination?.currentPage);
      setHasMore(response?.data?.pagination?.hasNextPage);
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          errorMessage[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong.",
      });
    }
  };
  /**
   * Function to call the blog list with next page number and it is used in the infintiy scroll
   */
  const loadFunc = () => {
    getBlogList(currentPage + 1);
  };
  return (
    <InfiniteScroll pageStart={0} loadMore={loadFunc} hasMore={hasMore}>
      <div className="bg-muted overflow-y-auto py-6 ">
        <div className="flex justify-between mx-6 ">
          <div className="text-2xl font-semibold">BLOGS</div>
        </div>

        <div className="flex flex-wrap mt-11 gap-16 justify-center mb-5">
          {blogList?.length === 0 ? (
            <div className="text-2xl font-semibold w-96 h-96 grid place-content-center">
              No Records Found
            </div>
          ) : (
            blogList?.map((value) => {
              return <BlogDetailview key={value.id} blog={value} />;
            })
          )}
        </div>
      </div>
    </InfiniteScroll>
  );
};
