import config from "./serverConfig";
import axios from "../axious";

export const deleteUser = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(
    config.API_URL + "/user/delete/" + id,
    {},
    { headers }
  );
  return response;
};

export const usersList = (searchValue, page, limit) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      `/user/list?search=${searchValue}&page=${page}&limit=${limit}`,
    { headers }
  );
  return response;
};
