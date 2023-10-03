import config from "./serverConfig";
import axios from "../axious";

export const addFacility = async (data) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.post(config.API_URL + "/facility/add", data, {
    headers,
  });
  return response;
};

export const updateFacility = (data, id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(config.API_URL + "/facility/update/" + id, data, {
    headers,
  });
  return response;
};

export const deleteFacility = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(
    config.API_URL + "/facility/delete/" + id,
    {},
    { headers }
  );
  return response;
};

export const listFacilities = (searchValue, page, limit) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      `/facility//list/admin/all?params=${searchValue}&page=${page}&limit=${limit}`,
    { headers }
  );
  return response;
};

export const ListAllFacility = () => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(config.API_URL + `/facility/all/list`, { headers });
  return response;
};
