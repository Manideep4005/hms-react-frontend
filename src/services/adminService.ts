import api from "../api/axios";

/* ---------- PROFILE ---------- */

export const getAdminProfile = async () => {
  const res = await api.get("/admin/profile");
  return res.data;
};

export const updateAdminProfile = async (data: any) => {
  const res = await api.put("/admin/profile", data);
  return res.data;
};

export const changeAdminPassword = async (data: any) => {
  const res = await api.put("/admin/change-password", data);
  return res.data;
};

/* ---------- USERS ---------- */

export const getUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const registerUser = async (role: string, data: any) => {
  const res = await api.post(`/admin/users/register?role=${role}`, data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

/* ---------- PATIENTS ---------- */

export const getPatients = async () => {
  const res = await api.get("/admin/patients");
  return res.data;
};

export const searchPatientById = async (id: number) => {
  const res = await api.get(`/admin/patients/search?id=${id}`);
  return res.data;
};

export const searchPatientByMobile = async (mobile: string) => {
  const res = await api.get(`/admin/patients/search?mobile=${mobile}`);
  return res.data;
};

export const getPatientFullDetails = async (patientId: number) => {
  const res = await api.get(`/admin/patient/getfullDetails/${patientId}`);
  return res.data;
};


/* ---------- APPOINTMENTS ---------- */

export const getAppointmentStats = async () => {
  const res = await api.get("/admin/appointment-stats");
  return res.data;
};

export const getAllAppointments = async () => {
  const res = await api.get("/admin/appointments");
  return res.data;
};

export const getTodayAppointments = async () => {
  const res = await api.get("/admin/appointments/today");
  return res.data;
};

export const getFutureAppointments = async () => {
  const res = await api.get("/admin/appointments/future");
  return res.data;
};

export const getPastAppointments = async () => {
  const res = await api.get("/admin/appointments/past");
  return res.data;
};

export const deleteAppointment = async (id: number) => {
  const res = await api.delete(`/admin/appointments/${id}`);
  return res.data;
};

/* ---------- GUEST APPOINTMENT ---------- */

export const createGuestAppointment = async (data: any) => {
  const res = await api.post("/admin/appointments/guest", data);
  return res.data;
};

/* ---------- DOCTORS ---------- */

export const getDoctors = async () => {
  const res = await api.get("/admin/doctors");
  return res.data;
};

export const getDoctor = async (id: number) => {
  const res = await api.get(`/admin/doctors/${id}`);
  return res.data;
};

export const createDoctor = async (data: any) => {
  const res = await api.post("/admin/doctors", data);
  return res.data;
};

export const updateDoctor = async (id: number, data: any) => {
  const res = await api.put(`/admin/doctors/${id}`, data);
  return res.data;
};

export const deleteDoctor = async (id: number) => {
  const res = await api.delete(`/admin/doctors/${id}`);
  return res.data;
};

/* ---------- DOCTOR AVAILABILITY ---------- */

// Create / Update availability
export const saveDoctorAvailability = async (data: any) => {
  const res = await api.post("/admin/doctor-availability", data);
  return res.data;
};

// Get availability for a doctor
export const getDoctorAvailability = async (doctorId: number) => {
  const res = await api.get(`/admin/doctor-availability/${doctorId}`);
  return res.data;
};

// Get all availability (admin view)
export const getAllAvailability = async () => {
  const res = await api.get("/admin/doctor-availability");
  return res.data;
};

// Delete availability
export const deleteAvailability = async (id: number) => {
  const res = await api.delete(`/admin/doctor-availability/${id}`);
  return res.data;
};

// Get slots (IMPORTANT)

export const getDoctorSlots = async (doctorId: number, date: string) => {
  const res = await api.get(
    `/admin/doctor-slots?doctorId=${doctorId}&date=${date}`,
  );
  return res.data;
};

/* ---------- BILLING ---------- */

export const getAllBills = async () => {
  const res = await api.get("/admin/bills");
  return res.data;
};

export const payBill = async (id: number) => {
  const res = await api.put(`/admin/bills/${id}/pay`);
  return res.data;
};
