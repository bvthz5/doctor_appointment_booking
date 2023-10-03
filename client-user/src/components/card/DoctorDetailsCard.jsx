export const DoctorDetailsCard = () => {
  return (
    <div className="w-[800px] h-72 bg-red-500 mb-7 flex items-center justify-between px-6">
      <img
        src="https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*"
        alt=""
        className="bg-white h-52 object-contain"
      />
      <div className="w-[500px] h-52  bg-white ms-6">
        <h1 className="text-2xl w-[400px] mb-3 text-[#42a895] h-7 line-clamp-2 ">
          Dr. Muthuvel Pandian
        </h1>
        <h1 className="text-xl w-[400px] mb-1 text-black h-7 line-clamp-2 ">
          Aster Medicity
        </h1>
        <h1 className="text-lg w-[400px] mb-1 text-black h-7 line-clamp-2 ">
          ENT
        </h1>
        <h1 className="text-lg w-[400px] mb-1 text-black h-7 line-clamp-2 ">
          MBBS MD
        </h1>
        <h1 className="text-lg w-[400px] mb-1 text-black h-7 line-clamp-2 ">
          Internal Medicine
        </h1>
      </div>
    </div>
  );
};
