import { useEffect, useState } from "react";
import { getAppointmentStats } from "../../services/doctorService";
import {
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    completed: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const res = await getAppointmentStats();
    setStats(res);
  };

  const Stat = ({ label, value }: any) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-2xl font-semibold text-gray-900 tracking-tight">
        {value}
      </span>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back — here’s your overview
          </p>
        </div>
      </div>

      {/* KPI STRIP (Stripe Style) */}
      <div className="grid grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:shadow-md transition">
          <Stat label="Total Appointments" value={stats.total} />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:shadow-md transition">
          <Stat label="Today" value={stats.today} />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:shadow-md transition">
          <Stat label="Completed" value={stats.completed} />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT - INSIGHT */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Today’s Snapshot
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
            You have{" "}
            <span className="font-semibold text-gray-900">
              {stats.today}
            </span>{" "}
            scheduled appointments today. Stay on track and manage your
            patient flow efficiently.
          </p>

          <div className="mt-5">
            <button
              onClick={() => navigate("/doctor/appointments")}
              className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
            >
              View full schedule <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* RIGHT - QUICK ACTIONS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/doctor/appointments")}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  Manage Appointments
                </span>
                <ArrowRight size={14} />
              </div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}