import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ROUTES_NAME } from "@/utils/routeName";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
const IMAGE_URL=import.meta.env.VITE_IMAGE_URL;

/**
 * card component for showing doctors details
 * @param {*} id of doctor, and other details of doctors
 * @returns a card component
 */
export const DoctorCard = ({ id, name, qualification, designation, image }) => {
  const navigate = useNavigate();
  return (
    <div>
    <Card
      className="w-60 cursor-pointer "
      onClick={() => {
        navigate(ROUTES_NAME?.doctorDetailView, { state: { id: id,image : image } });
      }}
    >
      <CardContent className="pb-1 px-0 bg-muted">
        <img
          src={IMAGE_URL+image}
          alt={"image of doctor"}
          className="h-60 w-full object-contain bg-white"
        />
      </CardContent>
      <CardFooter className="ps-2 grid">
        <h1 className="sm:text-lg sm:font-bold h-8 overflow-hidden line-clamp-1 text-titleblue" title={name}>{name}</h1>
        <span className="h-7 overflow-hidden line-clamp-1 text-textblue" title={qualification}>{qualification}</span>
        <span className="h-8 overflow-hidden line-clamp-1 text-textblue" title={designation}>{designation}</span>
      </CardFooter>
    </Card>
    </div>
  );
};
DoctorCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  qualification: PropTypes.string,
  designation: PropTypes.string,
  image: PropTypes.string,
};
