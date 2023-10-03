import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES_NAME } from "@/utils/routeName";
import PropTypes from "prop-types";

/**
 * General card component for showing details such as title and description for speciality, sub-speciality,service,facility
 * @param {*} title,description for speciality, sub-speciality,service,facility
 * @returns a general component
 */
export const GeneralCard = ({ title, description, type = true, id }) => {
  const naviagte = useNavigate();
  const { pathname } = useLocation();
  return (
    <Card className="w-80 bg-white text-titleblue rounded-none  group hover:bg-[#42a895] hover:border-none">
      <CardHeader>
        <CardTitle className="group-hover:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-36 text-textblue group-hover:text-white">
        <span className="break-all line-clamp-[7] overflow-hidden">
          {description}
        </span>
      </CardContent>
      {type && (
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => {
              naviagte(
                pathname === ROUTES_NAME.speciality
                  ? ROUTES_NAME.subSpeciality
                  : ROUTES_NAME.speciality,
                {
                  state: { id: id, title: title, description: description },
                }
              );
            }}
            size="sm"
            variant="ghost"
            className="flex align-middle text-muted-foreground  group-hover:border group-hover:bg-white"
          >
            <span>KNOW MORE</span>
            <ArrowRight className="ms-2 w-4 h-4 my-auto" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
GeneralCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.bool,
  id: PropTypes.number,
};
