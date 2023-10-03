import { useLocation } from "react-router-dom";

/**
 * Dislays the overview(title and discription) of the speciality and the details are passed through state in path
 * @returns speciality overview
 */
export const OverViewSpeciality = () => {
  const { state } = useLocation();
  return (
    <div className="flex w-full justify-center  mt-11 ">
      <div className="w-[80vw] md:w-[60vw] ">
        <h1 className="text-4xl mb-7 text-titleblue">{state?.title}</h1>
        <p className=" break-all text-md text-textblue">{state?.description}</p>
      </div>
    </div>
  );
};
