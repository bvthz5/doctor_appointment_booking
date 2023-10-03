import config from "./serverConfig";
import axios from "../axious";

export const AppointmentList = async (page, limit = 10) => {
    const headers = {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const response = axios.get(
      config.API_URL +
        `/booking/admin/appointments/all?page=${page.PageNumber}&limit=${limit}&search=${page.search}`,
      { headers }
    );
    return response;
  };