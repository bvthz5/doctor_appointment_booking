import { ROUTES_NAME } from "@/utils/routeName";
import { NavLink } from "react-router-dom";
import { ProfileDropDown } from "../profiledropdown/ProfileDropDown";

/**
 * Header of the site
 * @returns header component
 */
export const Header = () => {
  /**
   * function to remove id and name from localstorage when click on book appointment button
   */
  const handleNavigateClear = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("name");
  };
  return (
    <header className="bg-white z-50 top-0 sticky">
      <div className="mx-auto flex h-16 w-full items-center gap-8 px-4 sm:px-6 lg:px-8 bg-themegreen">
        <NavLink className={`block text-black`} to="/">
          <span className="sr-only">Home</span>
          <h1 className="font-black text-2xl text-white">MedEase</h1>
        </NavLink>

        <div className={`flex flex-1 items-center justify-end`}>
          <nav aria-label="Global">
            <ul className="flex items-center gap-6 text-md">
              <li className="max-sm:hidden">
                <NavLink
                  onClick={handleNavigateClear}
                  className={({ isActive }) =>
                    !isActive
                      ? "text-gray-500 transition hover:text-gray-500/75 p-2 bg-gray-200 rounded"
                      : "text-black font-semibold transition hover:text-gray-900/75 p-2 bg-gray-200 rounded"
                  }
                  to={ROUTES_NAME?.bookAppointment}
                >
                  Book Appointment
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    !isActive
                      ? "text-white transition border border-transparent hover:border-white p-2 rounded-sm"
                      : "text-white border border-white p-2 rounded-sm  transition hover:border hover:border-white"
                  }
                  to={ROUTES_NAME?.hospitalList}
                >
                  Hospitals
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          { (
            <ProfileDropDown/>
          )}
        </div>
      </div>
    </header>
  );
};
