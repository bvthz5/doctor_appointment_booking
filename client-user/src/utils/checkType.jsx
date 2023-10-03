import { ROUTES_NAME } from "./routeName";

 /** Function to set type in which getdoctors list api is called based on current pathname.*/
 export const checkType = (pathname) => {
    if (pathname === ROUTES_NAME.subSpeciality) {
      return 0;
    } else if (pathname === ROUTES_NAME.speciality) {
      return 1;
    } else {
      return 2;
    }
  };