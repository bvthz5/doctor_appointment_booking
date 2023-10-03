export const Stats = () => {
  return (
    <div className=" bg-white">
      <div className="w-full flex justify-end">
        <div className="w-[94%] py-10 max-md:py-7 max-md:w-[90%] me-4">
          <div className="w-full flex h-10 items-center pr-8 justify-between">
            <h1 className="text-titleblue text-4xl font-semibold  max-md:text-2xl max-sm:text-xlx">
              We will Treat You Well
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center pb-10 max-md:pb-7 ">
        <img
          src={
            "https://www.asterhospitals.in/sites/default/files/styles/webp/public/2021-11/aster-hospitals-best-hospital-in-india.jpg.webp?itok=PtGxr-2N"
          }
        />
        <div className="flex justify-center gap-x-16 py-10">
          <div className=" w-[100px]">
            <h1 className="text-3xl font-bold flex justify-center">18</h1>
            <p className="text-2xl flex justify-center">Hospitals</p>
            <p className="text-sm flex justify-center">
              Providing world-class healthcare
            </p>
          </div>
          <div className="gap-y-4 ">
            <h1 className="text-2xl">18+</h1>
            <h1 className="text-2xl">Hospitals</h1>
            <h1 className="text-2xl">18+</h1>
          </div>{" "}
          <div className="gap-y-4 ">
            <h1 className="text-2xl">18+</h1>
            <h1 className="text-2xl">Hospitals</h1>
            <h1 className="text-2xl">18+</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
