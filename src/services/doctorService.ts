import api from "../api/axios";

export const getDoctorProfile = () => api.get("/doctor/profile");
export const updateDoctorProfile = (data: any) =>
  api.put("/doctor/profile", data);

export const changeDoctorPassword = (data: any) =>
  api.put("/doctor/change-password", data);

export const getDoctorAppointments = () => api.get("/doctor/appointments");

export const completeAppointment = (id: number, data: any) =>
  api.put(`/doctor/appointments/${id}/complete`, data);

export const getAppointmentStats = async () => {
  const res = await api.get("/doctor/appointment-stats");
  return res.data;
};
