import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import PatientDashboard from "../pages/patient/PatientDashboard";
import Appointments from "../pages/patient/Appointments";
import BookAppointment from "../pages/patient/BookAppointment";
import Profile from "../pages/patient/Profile";
import ChangePassword from "../pages/patient/ChangePassword";
import MyBills from "../pages/patient/MyBills";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from "../pages/admin/Users";
import RegisterUser from "../pages/admin/RegisterUser";
import Patients from "../pages/admin/Patients";
import SearchPatient from "../pages/admin/SearchPatient";
import AdminAppointments from "../pages/admin/Appointments";
import GuestAppointment from "../pages/admin/GuestAppointment";
import AdminProfile from "../pages/admin/Profile";
import AdminChangePassword from "../pages/admin/ChangePassword";

import Doctors from "../pages/admin/doctors/Doctors";
import RegisterDoctor from "../pages/admin/doctors/RegisterDoctor";
import ViewDoctor from "../pages/admin/doctors/ViewDoctor";
import EditDoctor from "../pages/admin/doctors/EditDoctor";
import DoctorAvailability from "../pages/admin/doctors/DoctorAvailability";
import Billing from "../pages/admin/Billing";

import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import DoctorChangePassword from "../pages/doctor/DoctorChangePassword";
import DoctorProfile from "../pages/doctor/DoctorProfile";

import Unauthorized from "../pages/errors/Unauthorized";
import Forbidden from "../pages/errors/Forbidden";

import ProtectedRoute from "./ProtectedRoutes";
import AppLayout from "../layouts/AppLayout";
import ForgotPassword from "../pages/auth/ForgotPassword";
import PatientDetails from "../pages/admin/PatientDetails";

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ================= PATIENT ================= */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute role="PATIENT">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="my-bills" element={<MyBills />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="register" element={<RegisterUser />} />
        <Route path="patients" element={<Patients />} />
        <Route path="search" element={<SearchPatient />} />
        <Route path="patient/:patientId/details" element={<PatientDetails />} />


        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="guest-appointment" element={<GuestAppointment />} />

        <Route path="profile" element={<AdminProfile />} />
        <Route path="change-password" element={<AdminChangePassword />} />

        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/create" element={<RegisterDoctor />} />
        <Route path="doctors/:id" element={<ViewDoctor />} />
        <Route path="doctors/edit/:id" element={<EditDoctor />} />
        <Route path="doctors/availability" element={<DoctorAvailability />} />

        <Route path="billing" element={<Billing />} />
      </Route>

      {/* ================= DOCTOR ================= */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute role="DOCTOR">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="profile" element={<DoctorProfile />} />
        <Route path="change-password" element={<DoctorChangePassword />} />
      </Route>

      {/* Errors */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/forbidden" element={<Forbidden />} />
    </Routes>
  );
}

export default AppRoutes;