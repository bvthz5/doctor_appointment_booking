import { axiosPrivate } from "@/services/security/interceptor/interceptor";

export const doctorCreateBlog = (data) => {
  const response = axiosPrivate.post("/blog/add", data);
  return response;
};

export const doctrListBlog = (pageNo) => {
  const response = axiosPrivate.get(`/blog/listDoctor?page=${pageNo}&limit=10`);
  return response;
};

export const doctorBloggetById = (id) => {
  const response = axiosPrivate.get("/blog/list/" + id);
  return response;
};

export const doctorEditBlog = (id, data) => {
  const response = axiosPrivate.put("/blog/edit/" + id, data);
  return response;
};

export const doctorDeleteBlog = (id) => {
  const response = axiosPrivate.delete("/blog/delete/" + id);
  return response;
};
