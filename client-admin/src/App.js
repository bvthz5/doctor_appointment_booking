import React from "react";

import Router from "./routes/Router";
import "./App.css";

import ThemeProvider from "./theme";

import ScrollToTop from "./core/scroll-to-top";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <div>
        <ThemeProvider>
          <ScrollToTop />
          <Router />
        </ThemeProvider>
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
}
