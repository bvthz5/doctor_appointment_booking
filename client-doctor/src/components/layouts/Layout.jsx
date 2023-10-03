import { Outlet } from "react-router-dom";
import { Toaster } from "../ui/toaster";
import { Header } from "../header/Header";
/**
 * Layout is used to set header at top as default and switch the layout children
 * @returns layout of the project
 */
const Layout = () => {
  return (
    <>
      <main>
        <Header />
        <Outlet />
      </main>
      <Toaster />
    </>
  );
};

export default Layout;
