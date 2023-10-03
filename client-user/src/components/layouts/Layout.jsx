import { Outlet } from "react-router-dom";
import { Header } from "../header/Header";
import { Toaster } from "../ui/toaster";
/**
 * Layout is used to set header at top as default and switch the layout children
 * @returns layout of the project
 */
const Layout = () => {
  return (
    <>
      <main >
        <Header />
        <Outlet />
        <Toaster />
      </main>
    </>
  );
};

export default Layout;
