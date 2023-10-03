import config from "./serverConfig";
import axios from "../axious";

export const addSpecialty = async (data) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.post(config.API_URL + "/specialty/add", data, {
    headers,
  });
  return response;
};

export const editSpecialty = (id, data) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(config.API_URL + "/specialty/edit/" + id, data, {
    headers,
  });
  return response;
};

export const specialtyList = async (page, limit = 10) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      `/specialty/get/listAll?page=${page.PageNumber}&limit=${limit}&search=${page.search}`,
    { headers }
  );
  return response;
};

export const specialtyDelete = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(
    config.API_URL + "/specialty/delete/" + id,
    {},
    { headers }
  );
  return response;
};

export const ListSpecialtySubspecialty = () => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(config.API_URL + `/specialty/subspecialty/list`, {
    headers,
  });
  return response;
};
