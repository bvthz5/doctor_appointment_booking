import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
/**
 * Page used to display the success messages and next procedures
 * @returns message page
 */
export const MessagePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messageValue, setMessageValue] = useState("");
  const loginOrNot = localStorage.getItem("accessToken");

  useEffect(() => {
    const data = location.state;
    if (data === null) return navigate("/");
    const { message } = data;
    setMessageValue(message);
  }, [location.state, navigate]);

  return (
    <div className="grid place-content-center h-screen">
      <div className="mx-9 flex justify-center flex-col -mt-32">
        <h3 className="mb-8 p-4 bg-green-400 rounded-sm">{messageValue}</h3>
        <div className="flex justify-center">
          {loginOrNot === null || loginOrNot === "" ? (
            <Button onClick={() => navigate("/login")} className="w-[30vw]">
              Go to login
            </Button>
          ) : (
            <Button onClick={() => navigate("/")} className="w-[30vw]">
              Go to home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
