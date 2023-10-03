import config from "./serverConfig";
import axios from "../axious";

export const hospitalList = (page, limit = 10) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      `/hospitals/list/allHospital?page=${page.PageNumber}&limit=${limit}&search=${page.search}`,
    { headers }
  );
  return response;
};

export const addHospital = async (data) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.post(config.API_URL + "/hospitals/add", data, {
    headers,
  });
  return response;
};

export const editHospital = (id, data) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(config.API_URL + "/hospitals/edit/" + id, data, {
    headers,
  });
  return response;
};

export const HospitalView = (id) => {
  const response = axios.get(config.API_URL + "/hospitals/" + id);
  return response;
};

export const HospitalDelete = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(
    config.API_URL + "/hospitals/delete/" + id,
    {},
    { headers }
  );
  return response;
};

export const HospitalDetailView = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(config.API_URL + "/hospitals/get/" + id, {
    headers,
  });
  return response;
};


export const hospitalListAddDoctor = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(config.API_URL + "/hospitals/all/list", {
    headers,
  });
  return response;
};
