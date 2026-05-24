import api from "../api/axios";

export const getProfile = async () => {
  const res = await api.get("/patient/profile");
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await api.put("/patient/profile", data);
  return res.data;
};

export const changePassword = async (data: any) => {
  const res = await api.put("/patient/change-password", data);
  return res.data;
};

export const getDoctors = async () => {
  const res = await api.get("/patient/doctors");
  return res.data;
};

export const getAppointments = async () => {
  const res = await api.get("/patient/appointments");
  return res.data;
};

export const bookAppointment = async (data: any) => {
  const res = await api.post("/patient/appointments", data);
  return res.data;
};

export const cancelAppointment = async (id: number) => {
  const res = await api.put(`/patient/appointments/${id}/cancel`);
  return res.data;
};

export const editAppointment = async (id: number, data: any) => {
  const res = await api.put(`/patient/appointments/${id}`, data);
  return res.data;
};

export const getDoctorSlots = async (doctorId: number, date: string) => {
  const res = await api.get(
    `/patient/doctor-slots?doctorId=${doctorId}&date=${date}`,
  );
  return res.data;
};

export const getDoctorAvailability = async (doctorId: number) => {
  const res = await api.get(`/patient/doctor-availability/${doctorId}`);
  return res.data;
};

export const getMyBills = async () => {
  const res = await api.get("/patient/my-bills");
  return res.data;
};

export const payBill = async (billId: number) => {
  const res = await api.put(`/patient/pay/${billId}`);
  return res.data;
};
