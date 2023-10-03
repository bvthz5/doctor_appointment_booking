import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PropTypes from "prop-types";
const IMAGE_URL=import.meta.env.VITE_IMAGE_URL;

/**
 * Hospital card for showing the details of hospital
 * @param {*} name,city,phoneNo,image of the hospital
 * @returns a hospital card component
 */
export const HospitalCard = ({ name, city, phoneNo, image }) => {
  return (
    <Card className="w-60 ">
      <CardContent className="pb-2 px-0 bg-slate-300">
        <img
          src={IMAGE_URL+image}
          alt={"Image of hospital"}
          className="h-60 w-full rounded-sm object-contain "
        />
      </CardContent>
      <CardFooter className="ps-2 grid">
        <h1 className="sm:text-lg sm:font-bold h-8 overflow-hidden line-clamp-1" title={name}>{name}</h1>
        <span className="h-7 overflow-hidden line-clamp-1" title={city}>{city}</span>
        <span className= "h-8 overflow-hidden line-clamp-1" title={phoneNo}>{phoneNo}</span>
      </CardFooter>
    </Card>
  );
};
HospitalCard.propTypes = {
  name: PropTypes.string,
  city: PropTypes.string,
  phoneNo: PropTypes.any,
  image: PropTypes.string,
};