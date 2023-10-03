import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import { DoctorSlider } from "@/components/doctorslider/DoctorSlider";
import { HospitalSlider } from "@/components/hospitalSlider/HospitalSlider";
import { BlogSlider } from "@/components/blogSlider/BlogSlider";

/**
 * Dummy data
 */
const bannerImages = [
  {
    id: 1,
    image: banner2,
  },
  {
    id: 2,
    image: banner1,
  },
];
/**
 * Home page that contains the overview of the website
 * @returns Homepage of the website
 */
export const HomePage = () => {
  return (
    <div>
      <Carousel
        showThumbs={false}
        autoPlay={true}
        swipeable={true}
        transitionTime={2}
        infiniteLoop={true}
      >
        {bannerImages.map((value) => {
          return (
            <div key={value?.id}>
              <img src={value?.image} />
             
            </div>
          );
        })}
      </Carousel>

      <HospitalSlider />
      <DoctorSlider />
      <BlogSlider />
    </div>
  );
};
