import config from "./serverConfig";
import axios from "../axious";

export const deletePackage = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.delete(
    config.API_URL + "/package/" + id,
    {},
    { headers }
  );
  return response;
};

export const packageLists = (searchValue,hospital, page, limit) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      `/package?search=${searchValue}&hospitalId=${hospital}&page=${page}&limit=${limit}`,
    { headers }
  );
  return response;
};

export const addPackage = (data) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.post(config.API_URL + `/package`, data, {
    headers,
  });
  return response;
};

export const editPackage = (data,id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(config.API_URL + `/package/${id}`, data, {
    headers,
  });
  return response;
};
