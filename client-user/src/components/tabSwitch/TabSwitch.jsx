import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import { OverViewMain } from "../overView/OverViewMain";
import { ROUTES_NAME } from "@/utils/routeName";
import { ContactView } from "../contactView/ContactView";
import { ServiceView } from "../serviceView/ServiceView";
import { SpecialityList } from "../specialiity/SpecialityList";
import { SubSpecialityList } from "../subspeciality/SubSpecialityList";
import { DoctorList } from "../doctor/DoctorList";
import { FacilityList } from "../facility/FacilityList";
import PropTypes from "prop-types";

/**
 * Component used to switch between tabs
 * @param {*} contactInfo is the information of the hospitals
 * @returns tab
 */
export const TabSwitch = ({ contactInfo }) => {
  let { pathname } = useLocation();
  pathname = pathname.toLowerCase();
  return (
    <Tabs defaultValue="overView">
      <TabsList className="flex w-full flex-wrap h-max sm:space-x-5 sticky bg-white top-16 z-10">
        <TabsTrigger value="overView">Overview</TabsTrigger>
        {pathname === ROUTES_NAME.hospitalDetail && (
          <TabsTrigger value="speciality">Speciality</TabsTrigger>
        )}
        {pathname !== ROUTES_NAME.subSpeciality && (
          <TabsTrigger value="subSpeciality">Sub Speciality</TabsTrigger>
        )}
        <TabsTrigger value="doctor">Doctor</TabsTrigger>
        <TabsTrigger value="service">Service</TabsTrigger>
        <TabsTrigger value="facility">Facilites</TabsTrigger>
        {pathname === ROUTES_NAME.hospitalDetail && (
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="overView">
        <OverViewMain hospitalId={contactInfo?.id} />
      </TabsContent>
      <TabsContent value="doctor">
        <DoctorList />
      </TabsContent>
      <TabsContent value="speciality">
        <SpecialityList hospitalId={contactInfo?.id} />
      </TabsContent>
      <TabsContent value="subSpeciality">
        <SubSpecialityList />
      </TabsContent>
      <TabsContent value="service">
        <ServiceView />
      </TabsContent>
      <TabsContent value="facility">
        <FacilityList />
      </TabsContent>
      <TabsContent value="contact">
        <ContactView contactInfo={contactInfo} />
      </TabsContent>
    </Tabs>
  );
};
TabSwitch.propTypes = {
  contactInfo: PropTypes.any,
};