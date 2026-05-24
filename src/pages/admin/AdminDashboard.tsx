import { useEffect, useState } from "react";
import {
  getUsers,
  getPatients,
  getAllAppointments,
  getTodayAppointments,
} from "../../services/adminService";
import {
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const [u, p, a, t] = await Promise.all([
        getUsers(),
        getPatients(),
        getAllAppointments(),
        getTodayAppointments(),
      ]);

      setStats({
        users: u.length,
        patients: p.length,
        appointments: a.length,
        today: t.length,
      });
    };

    load();
  }, []);

  const Stat = ({ label, value }: any) => (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 tracking-tight">
        {value ?? 0}
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor system activity and performance
          </p>
        </div>

      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border rounded-2xl p-5 hover:shadow-md transition">
          <Stat label="Users" value={stats.users} />
        </div>

        <div className="bg-white border rounded-2xl p-5 hover:shadow-md transition">
          <Stat label="Patients" value={stats.patients} />
        </div>

        <div className="bg-white border rounded-2xl p-5 hover:shadow-md transition">
          <Stat label="Appointments" value={stats.appointments} />
        </div>

        <div className="bg-white border rounded-2xl p-5 hover:shadow-md transition">
          <Stat label="Today" value={stats.today} />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SYSTEM INSIGHT */}
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            System Insight
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
            There are{" "}
            <span className="font-semibold text-gray-900">
              {stats.today}
            </span>{" "}
            appointments scheduled today across{" "}
            <span className="font-semibold text-gray-900">
              {stats.patients}
            </span>{" "}
            patients.
          </p>

          <div className="mt-4">
            <button
              onClick={() => navigate("/admin/appointments")}
              className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
            >
              View detailed schedule <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/admin/users")}
              className="w-full flex justify-between items-center px-4 py-3 border rounded-xl hover:bg-gray-50 transition"
            >
              Manage Users
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate("/admin/patients")}
              className="w-full flex justify-between items-center px-4 py-3 border rounded-xl hover:bg-gray-50 transition"
            >
              Manage Patients
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate("/admin/appointments")}
              className="w-full flex justify-between items-center px-4 py-3 border rounded-xl hover:bg-gray-50 transition"
            >
              View Appointments
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}