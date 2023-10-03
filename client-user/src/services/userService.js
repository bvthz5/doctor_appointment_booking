import { axiosPrivate } from "./security/interceptor/interceptor";

export const cancelUserBookingById = (id) => {
  return axiosPrivate.put(`booking/cancel/${id}`);
};

export const getUserBookingById = (id) => {
  return axiosPrivate.get(`booking/cancel/${id}`);
};
