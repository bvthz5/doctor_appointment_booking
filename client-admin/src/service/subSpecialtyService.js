import config from "./serverConfig";
import axios from "../axious";

export const subSpecialtyList = async (page, limit = 10) => {
    const headers = {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const response = axios.get(
      config.API_URL +
        `/subspecialty/get/listAll?page=${page.PageNumber}&limit=${limit}&search=${page.search}`,
      { headers }
    );
    return response;
  };

  export const SubSpecialtyDelete = (id) => {
    const headers = {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const response = axios.put(
      config.API_URL + "/subspecialty/delete/" + id,
      {},
      { headers }
    );
    return response;
  };

  export const addSubSpecialtyApi = async (data) => {
    const headers = {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const response = axios.post(config.API_URL + "/subspecialty/add", data, {
      headers,
    });
    return response;
  };
  
  export const editSubSpecialtyApi = (id, data) => {
    const headers = {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const response = axios.put(config.API_URL + "/subspecialty/edit/" + id, data, {
      headers,
    });
    return response;
  };


  export const subSpecialtyAddDoctor = async (hospitalId,specialtyId) => {
    const headers = {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const response = axios.get(
      config.API_URL +
        `/subspecialty/all/${hospitalId}/${specialtyId}`,
      { headers }
    );
    return response;
  };