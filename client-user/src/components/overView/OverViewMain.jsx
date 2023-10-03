import { useLocation } from "react-router-dom";
import { OverViewHospital } from "./OverViewHospital";
import { OverViewSpeciality } from "./OverViewSpeciality";
import { ROUTES_NAME } from "@/utils/routeName";
import { OverViewSubSpeciality } from "./OverViewSubSpeciality";
import PropTypes from "prop-types";

/**
 * Display overview pages of Hospital,speciality, Subspeciality based on the value of pathname variable
 * @param {*} hospitalId
 * @returns Overview page
 */
export const OverViewMain = ({ hospitalId }) => {
  let { pathname } = useLocation();
  pathname = pathname.toLowerCase();

  /**
   * This function is a helper function that determines which component to render based on the value of the pathname variable.
   * @returns component based on the value of pathname
   */
  function renderOverviewComponent() {
    switch (pathname) {
      case ROUTES_NAME?.hospitalDetail:
        return <OverViewHospital hospitalId={hospitalId} />;
      case ROUTES_NAME?.speciality:
        return <OverViewSpeciality />;
      default:
        return <OverViewSubSpeciality />;
    }
  }

  return <div>{renderOverviewComponent()}</div>;
};
OverViewMain.propTypes = {
  hospitalId: PropTypes.any,
};