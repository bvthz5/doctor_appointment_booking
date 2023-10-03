import config from "./serverConfig";
import axios from "../axious";

export const login = (data) => {
  const response = axios.post(config.API_URL + "/admin/login", data);
  return response;
};

export const addAdmin = async (data) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.post(config.API_URL + "/admin/addAdmin", data, {
    headers,
  });
  return response;
};

export const updateAdmin = (data, id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(config.API_URL + "/admin/edit/" + id, data, {
    headers,
  });
  return response;
};

export const deleteAdmin = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(
    config.API_URL + "/admin/delete/" + id,
    {},
    { headers }
  );
  return response;
};

export const adminListt = (searchValue, page, limit) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      `/admin/list?search=${searchValue}&page=${page}&limit=${limit}`,
    { headers }
  );
  return response;
};

export const ListAllAdminsRole = () => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(config.API_URL + `/admin/all/list/role`, {
    headers,
  });
  return response;
};
