import config from "./serverConfig";
import axios from "../axious";


export const addService = async (data) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.post(config.API_URL + "/service", data, {
    headers,
  });
  return response;
};

export const updateService = (data, id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(config.API_URL + "/service/" + id, data, {
    headers,
  });
  return response;
};

export const deleteService = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.delete(
    config.API_URL + "/service/" + id,
    { headers }
  );
  return response;
};

export const serviceLists = (searchValue, page, limit) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      `/service?params=${searchValue}&page=${page}&limit=${limit}`,
    { headers }
  );
  return response;
};

export const specialtyAddDoctor = (hospitalId) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      "/specialty/all/list/"+hospitalId,
    { headers }
  );
  return response;
 
};

export const ListAllService = () => {
  
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(config.API_URL + `/service/all/list`, {
    headers,
  });
  return response;
};


export const adminHospitall = () => {
  
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(config.API_URL + `/hospitals/admin/hospital`, {
    headers,
  });
  return response;
};
  
