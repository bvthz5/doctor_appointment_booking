import { axiosPrivate } from "@/services/security/interceptor/interceptor";

export const getHospitalDetailById = (id) => {
  const response = axiosPrivate.get(`/hospitals/${id}`);
  return response;
};
export const getAllHospitalList = (pageNo, searchKey = "", limit = 10) => {
  const response = axiosPrivate.get(
    `/hospitals?page=${pageNo}&orderByEmail=true&limit=${limit}&search=${searchKey}`
  );
  return response;
};
export const getAllService = (pageNo, id) => {
  const response = axiosPrivate.get(
    `/service/list/${id}?page=${pageNo}&limit=10`
  );
  return response;
};

export const getSpecialityList = (id, page, limit) => {
  const response = axiosPrivate.get(
    `/specialty/list/${id}?page=${page}&limit=${limit}`
  );
  return response;
};

export const getSubSpecialityList = (id, type, page) => {
  const response = axiosPrivate.get(
    `/subspecialty/list/${id}?page=${page}&limit=10&type=${type}`
  );
  return response;
};

export const getOtpFromEmail = (email) => {
  const response = axiosPrivate.post(`/booking/addEmail`, email);
  return response;
};

export const verifyOtpOfUser = (otp) => {
  const response = axiosPrivate.put(`/booking/otpVerification`, otp);
  return response;
};

export const getDoctorsList = (id, page, type, limit = 10, searchKey = "") => {
  const response = axiosPrivate.get(
    `/doctors/list?id=${id}&search=${searchKey}&page=${page}&limit=${limit}&type=${type} `
  );
  return response;
};
export const addUserDetails = (data) => {
  const response = axiosPrivate.put(`booking/addUser`, data);
  return response;
};
export const getFacilityList = (id, page, type) => {
  const response = axiosPrivate.get(
    `/facility/list/${id}?page=${page}&limit=10&type=${type}`
  );
  return response;
};

export const getDoctorDetailsById = (id) => {
  const response = axiosPrivate.get(`doctors/view/${id}`);
  return response;
};

export const getSlotsOfDoctor = (doctorId, date) => {
  const response = axiosPrivate.get(
    `/booking/doctor?doctorId=${doctorId}&date=${date}`
  );
  return response;
};

export const bookAnAppointment = (data) => {
  const response = axiosPrivate.post(`booking/addbooking`, data);
  return response;
};

export const getUserBookedList = (pageNo, limit = 10) => {
  const response = axiosPrivate.get(
    `booking/userBookings?page=${pageNo}&limit=${limit}`
  );
  return response;
};

export const getAllTopDoctors = (
  pageNo,
  limit = 10,
  specialtyId = "",
  hospitalId = ""
) => {
  const response = axiosPrivate.get(
    `/doctors/famousDoctors?page=${pageNo}&limit=${limit}&specialtyId=${specialtyId}&hospitalId=${hospitalId}`
  );
  return response;
};

export const getBlogAll = (pageNo) => {
  const response = axiosPrivate.get(`blog/listAll?page=${pageNo}&limit=10`);
  return response;
};

export const updateBooking = (id, data) => {
  const response = axiosPrivate.put(`/booking/update/${id}`, data);
  return response;
};

export const getAllSpecialities = (page, limit) => {
  const response = axiosPrivate.get(
    `/specialty/?page=${page}&limit=${limit}`
  );
  return response;
};
