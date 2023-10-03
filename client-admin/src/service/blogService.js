import config from "./serverConfig";
import axios from "../axious";

export const deleteBlog = (id) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.delete(
    config.API_URL + "/blog/admin/delete/" + id,
    { headers }
  );
  return response;
};

export const blogLists = (searchValue, page,hospital,doctor, limit) => {
  const headers = {
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
  const response = axios.get(
    config.API_URL +
      `/blog/admin/blogs/all?search=${searchValue}&page=${page}&limit=${limit}&hospitalId=${hospital}&doctorId=${doctor}`,
    { headers }
  );
  return response;
};


export const updateBlog = (data, id) => {
    const headers = {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const response = axios.put(config.API_URL + "/blog/admin/edit/" + id, data, {
      headers,
    });
    return response;
  };

  export const blogView = (id) => {
    const headers = {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const response = axios.get(config.API_URL + "/blog/admin/blogs/get/" + id, {
      headers,
    });
    return response;
  };