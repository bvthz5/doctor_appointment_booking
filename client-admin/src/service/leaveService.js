import config from "./serverConfig";
import axios from "../axious";

export const LeaveList = (page, limit = 10) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      `/doctor/leave/getAll?page=${page.PageNumber}&limit=${limit}&search=${page.search}`,
    { headers }
  );
  return response;
};
