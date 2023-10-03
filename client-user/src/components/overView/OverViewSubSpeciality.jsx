import { useLocation } from "react-router-dom";
/**
 * Dislays the overview(title and discription) of the subspeciality and the details are passed through state in path
 * @returns subspeciality overview
 */
export const OverViewSubSpeciality = () => {
  const { state } = useLocation();
  return (
    <div className="flex w-full justify-center  mt-11 ">
      <div className="w-[80vw] md:w-[60vw] ">
        <h1 className="text-4xl mb-7">{state?.title}</h1>
        <p className=" break-all text-md text-muted-foreground">
          {state?.description}
        </p>
      </div>
    </div>
  );
};
