import { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowLeftIcon, ArrowRight, ArrowRightIcon } from "lucide-react";
import { ROUTES_NAME } from "@/utils/routeName";
import { getBlogAll } from "@/services/hospitalService";
import { BlogDetailview } from "./BlogDetailview";


export const BlogSlider = () => {
  const [blogList, setBlogList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef();

  /**
   * Function get Blogs
   * @param {*} pageNo
   */
  const getAllBlogs = async (pageNo) => {
    try {
      setIsLoading(true);
      const response = await getBlogAll(pageNo);
      setIsLoading(false);
      setBlogList(response?.data?.items);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllBlogs(1);
  }, []);
  return (
    <div className="w-full flex justify-end bg-white">
      <div className="w-[94%] py-10 max-md:py-7 max-md:w-[90%] me-4">
        <div className="w-full flex h-24 items-center pr-8 justify-between">
          <h1 className="text-titleblue text-4xl font-semibold  max-md:text-2xl max-sm:text-xlx">
            Blogs
          </h1>
          <Button
            onClick={() => {
              navigate(ROUTES_NAME.blogList);
            }}
            className="bg-[#328090] text-white border border-[#328090]  hover:bg-[#328090]"
          >
            View All <ArrowRight />
          </Button>
        </div>
        <div>
          <div
            className="flex gap-16 justify-start max-w-full overflow-y-auto "
            ref={scrollRef}
          >
            {blogList?.length === 0 && !isLoading ? (
              <h1 className="h-32 text-2xl flex justify-center items-center text-textblue">
                No Blogs found
              </h1>
            ) : (
              blogList?.map((data) => (
                <BlogDetailview key={data?.id} blog={data} />
              ))
            )}
          </div>
          <div className="flex gap-x-5 mt-4">
            <Button
              onClick={() => {
                scrollRef.current.scrollBy({
                  left: -360,
                  behavior: "smooth",
                });
              }}
            >
              <ArrowLeftIcon />
            </Button>
            <Button
              onClick={() => {
                scrollRef.current.scrollBy({
                  left: 360,
                  behavior: "smooth",
                });
              }}
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
