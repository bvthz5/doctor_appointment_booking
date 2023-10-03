import { NavLink } from "react-router-dom";
import { ProfileDropDown } from "../dropdown/ProfileDropDown";

/**
 *Unfinished header. just used to navigate between pages, needed to style.
 * @returns header of the website.
 *  */
export const Header = () => {
  return (
    <header className="bg-[#328090] left-0 right-0 top-0 sticky">
      <div className="mx-auto flex h-16 w-full items-center gap-8 px-4 sm:px-6 lg:px-8 ">
        <NavLink className={`block text-black`} to="/">
          <span className="sr-only">Home</span>
          <h1 className="font-black text-2xl text-white">MedEase</h1>
        </NavLink>

        <div className={`flex flex-1 items-center justify-end`}>
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-md">
              <li>
                <NavLink
                  className={({ isActive }) =>
                    !isActive
                      ? "text-white text-[16px] transition hover:text-gray-300/95"
                      : "text-white text-[16px] font-bold transition "
                  }
                  to="/"
                >
                  Appointments
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    !isActive
                      ? "text-white text-[16px] transition hover:text-gray-300/95"
                      : "text-white text-[16px] font-bold transition "
                  }
                  to={"/patient-list"}
                >
                  Patient-List
                </NavLink>
              </li>

              <li>
                <NavLink
                  className={({ isActive }) =>
                    !isActive
                      ? "text-white text-[16px] transition hover:text-gray-300/95"
                      : "text-white text-[16px] font-bold transition "
                  }
                  to="/blog"
                >
                  Blog
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="sm:flex sm:gap-4">
            <ProfileDropDown profileOrHanberger={false} />
          </div>
          <ProfileDropDown profileOrHanberger={true} />
        </div>
      </div>
    </header>
  );
};
