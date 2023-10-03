import config from "./serverConfig";
import axios from "../axious";

export const addDoctor = async (data) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.post(config.API_URL + "/doctors/add", data, {
    headers,
  });
  return response;
};

export const updateDoctor = (data, id) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(config.API_URL + "/doctors/edit/" + id, data, {
    headers,
  });
  return response;
};

export const deleteDoctor = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.put(
    config.API_URL + "/doctors/delete/" + id,
    {},
    { headers }
  );
  return response;
};

export const doctorList = (
  searchValue,
  page,
  hospital,
  specialty,
  subSpecialty,
  limit
) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      `/doctors/doctorlist?search=${searchValue}&page=${page}&limit=${limit}&id=${hospital}&specialtyId=${specialty}&subspecialtyId=${subSpecialty}`,
    { headers }
  );
  return response;
};

export const doctorView = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(config.API_URL + "/doctors/details/" + id, {
    headers,
  });
  return response;
};
