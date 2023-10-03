import config from "./serverConfig";
import axios from "../axious";


export const addTimeSlot = async (data) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.post(config.API_URL + "/timeSlot/addTimeSlot", data, {
    headers,
  });
  return response;
};

export const updateTimeSlot = (data, id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(config.API_URL + "/timeSlot/edit/" + id, data, {
    headers,
  });
  return response;
};

export const deleteTimeSlot = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(
    config.API_URL + "/timeSlot/delete/" + id,
    {},
    { headers }
  );
  return response;
};

export const timeSlotListt = ( page, limit) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      `/timeSlots?page=${page}&limit=${limit}`,
    { headers }
  );
  return response;
};
