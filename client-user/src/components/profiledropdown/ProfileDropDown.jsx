import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Building, Home, LogIn, LogOut, User } from "lucide-react";
import { ROUTES_NAME } from "@/utils/routeName";

/**
 * If profileOrHanberger prop is false then avatar icon with dropdown is showned else drop down with hamberger icon.
 * @param {*} profileOrHanberger is used for switching the dropdown menu
 * @returns dropdown
 */
export const ProfileDropDown = ({ profileOrHanberger = false }) => {
  const token = localStorage.getItem("accessToken");
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
            <AvatarFallback className="bg-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-56 block ${profileOrHanberger && "md:hidden"}`}
      >
        {token ? (
          <>
            <DropdownMenuGroup>
              <NavLink to={ROUTES_NAME.userViewBooking}>
                <DropdownMenuItem>
                  <Home className="mr-2 h-4 w-4" />
                  <span>View Bookings</span>
                </DropdownMenuItem>
              </NavLink>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => localStorage.clear()}>
              <>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </>
            </DropdownMenuItem>
          </>
        ) : (
          <NavLink to={ROUTES_NAME.bookAppointment}>
            <DropdownMenuItem>
              <>
                <LogIn className="mr-2 h-4 w-4" />
                <span>Log in</span>
              </>
            </DropdownMenuItem>
          </NavLink>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
