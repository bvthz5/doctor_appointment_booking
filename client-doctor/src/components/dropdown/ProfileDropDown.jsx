import { LogOut, Home, Building, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PropTypes from "prop-types";

const userLoggedInOrNot = false;

/**
 * If profileOrHanberger prop is false then avatar icon with dropdown is showned else drop down with hamberger icon.
 * @param {*} profileOrHanberger is used for switching the dropdown menu 
 * @returns dropdown
 */
export const ProfileDropDown = ({ profileOrHanberger = false }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {profileOrHanberger ? (
          <Button variant="outline" className="block md:hidden">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        ) : (
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-white"><User className="w-4 h-4"/></AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-56 block ${profileOrHanberger && "md:hidden"}`}
      >
        {userLoggedInOrNot && (
          <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        {profileOrHanberger ? (
          <DropdownMenuGroup>
            <NavLink to="/">
              <DropdownMenuItem>
                <Home className="mr-2 h-4 w-4" />
                <span>Appointments</span>
              </DropdownMenuItem>
            </NavLink>
            <NavLink to="/blog">
              <DropdownMenuItem>
                <Building className="mr-2 h-4 w-4" />
                <span>Blog</span>
              </DropdownMenuItem>
            </NavLink>
          </DropdownMenuGroup>
        ) : (
          <>
            <DropdownMenuGroup>
              <NavLink to="/profile">
                <DropdownMenuItem>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </NavLink>
              <NavLink to="/doctor-leave">
                <DropdownMenuItem>
                  <Building className="mr-2 h-4 w-4" />
                  <span>Leaves</span>
                </DropdownMenuItem>
              </NavLink>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <NavLink to="/login">
              <DropdownMenuItem onClick={() => localStorage.clear()}>
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </>
              </DropdownMenuItem>
            </NavLink>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
ProfileDropDown.propTypes = { profileOrHanberger: PropTypes.bool };
