import { axiosPrivate } from "@/services/security/interceptor/interceptor";

export const doctorLogin = (data) => {
  const response = axiosPrivate.post("/doctors/login", data);
  return response;
};

export const doctorForgotPassword = (data) => {
  const response = axiosPrivate.put("/users/forgotpassword", data);
  return response;
};

export const doctorResetPassword = (data) => {
  const response = axiosPrivate.put("/users/resetPassword", data);
  return response;
};

export const doctorGetProfile = (data) => {
  const response = axiosPrivate.get("/doctors/profile", data);
  return response;
};

export const doctorUpdateProfile = (data) => {
  const response = axiosPrivate.put("/doctors/update", data);
  return response;
};

export const getPatientList = (pageNo, limit = 10) => {
  const response = axiosPrivate.get(
    `/booking/patient?page=${pageNo}&limit=${4}`
  );
  return response;
};

export const getPatientById = (pageNo, id, limit = 10) => {
  const response = axiosPrivate.get(
    `/booking/history/${id}?page=${pageNo}&limit=${limit}`
  );
  return response;
};

export const getAllDoctorAppointmentList = (pageNo, date = "", status = "") => {
  const response = axiosPrivate.get(
    `/booking/view/1?type=${status}&orderBy=desc&search=${date}&page=${pageNo}&perPage=10`
  );
  return response;
};

export const acceptRejectAppointment = (bookingId, data) => {
  const response = axiosPrivate.put(`booking/confirmation/` + bookingId, data);
  return response;
};

export const getSlotsOfDoctor = (doctorId, date) => {
  const response = axiosPrivate.get(
    `/booking/doctor?doctorId=${doctorId}&date=${date}`
  );
  return response;
};

export const updateSlot = (id, data) => {
  const response = axiosPrivate.put(`/booking/changeTime/${id}`, data);
  return response;
};

export const applyLeave = (data) => {
  const response = axiosPrivate.post(`/doctor/leave`, data);
  return response;
};

export const allLeaves = (page) => {
  const response = axiosPrivate.get(
    `/doctor/leaveList?order=desc&limit=30&page=${page}`
  );
  return response;
};

export const addDescription = (data) => {
  const response = axiosPrivate.post(`/doctors/history`, data);
  return response;
};

export const cancelLeave = (id) => {
  const response = axiosPrivate.put(`/doctor/deleteLeave/${id}`);
  return response;
};
