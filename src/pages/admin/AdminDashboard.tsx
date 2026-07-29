import { useEffect, useState } from "react";
import {
  getUsers,
  getPatients,
  getAllAppointments,
  getTodayAppointments,
} from "../../services/adminService";
import {
  ArrowRight,
  Users,
  UserRound,
  CalendarRange,
  CalendarClock,
  UserPlus,
  ClipboardList,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Stats {
  users: number;
  patients: number;
  appointments: number;
  today: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
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

  const loading = stats === null;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Share of today's appointments against the total book, used for the
  // insight ring below. Falls back gracefully while data is loading.
  const loadShare =
    !loading && stats.appointments > 0
      ? Math.min(100, Math.round((stats.today / stats.appointments) * 100))
      : 0;

  const kpis = [
    {
      key: "users",
      label: "Total Users",
      value: stats?.users,
      icon: Users,
    },
    {
      key: "patients",
      label: "Total Patients",
      value: stats?.patients,
      icon: UserRound,
    },
    {
      key: "appointments",
      label: "Appointments",
      value: stats?.appointments,
      icon: CalendarRange,
    },
    {
      key: "today",
      label: "Today's Appointments",
      value: stats?.today,
      icon: CalendarClock,
    },
  ];

  const quickActions = [
    {
      label: "Manage Users",
      description: "Roles, access & accounts",
      icon: UserPlus,
      path: "/admin/users",
    },
    {
      label: "Manage Patients",
      description: "Records & profiles",
      icon: ClipboardList,
      path: "/admin/patients",
    },
    {
      label: "View Appointments",
      description: "Full schedule & history",
      icon: CalendarDays,
      path: "/admin/appointments",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-blue-600 mb-1">
            {today}
          </p>
          {/* <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Monitor system activity and performance
          </p> */}
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {kpis.map(({ key, label, value, icon: Icon }) => (
          <div
            key={key}
            className="group relative bg-white ring-1 ring-gray-200 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:ring-blue-200 hover:shadow-[0_8px_24px_-12px_rgba(37,99,235,0.25)]"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={18} strokeWidth={2} />
              </div>
            </div>

            <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>

            {loading ? (
              <div className="h-7 sm:h-8 w-14 rounded-md bg-gray-100 animate-pulse" />
            ) : (
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight tabular-nums">
                {value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* SYSTEM INSIGHT */}
        <div className="lg:col-span-2 bg-white ring-1 ring-gray-200 rounded-2xl p-5 sm:p-6 transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              System Insight
            </h3>
            <span className="text-[11px] font-medium text-gray-400">
              Live
            </span>
          </div>

          <div className="flex items-center gap-5 sm:gap-6">
            {/* Progress ring: today's appointments as a share of the full book */}
            <div className="relative shrink-0 h-20 w-20 sm:h-24 sm:w-24">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#EFF2F6"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={
                    2 * Math.PI * 42 * (1 - (loading ? 0 : loadShare) / 100)
                  }
                  className="transition-[stroke-dashoffset] duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base sm:text-lg font-semibold text-gray-900 tabular-nums">
                  {loading ? "–" : `${loadShare}%`}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              There{" "}
              {loading ? (
                <span className="inline-block h-4 w-24 rounded bg-gray-100 animate-pulse align-middle" />
              ) : (
                <>
                  {stats.today === 1 ? "is" : "are"}{" "}
                  <span className="font-semibold text-gray-900">
                    {stats.today}
                  </span>{" "}
                  appointment{stats.today !== 1 ? "s" : ""} scheduled today
                  across{" "}
                  <span className="font-semibold text-gray-900">
                    {stats.patients}
                  </span>{" "}
                  active patient{stats.patients !== 1 ? "s" : ""}.
                </>
              )}
            </p>
          </div>

          <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100">
            <button
              onClick={() => navigate("/admin/appointments")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
            >
              View detailed schedule
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white ring-1 ring-gray-200 rounded-2xl p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Quick Actions
          </h3>

          <div className="space-y-2">
            {quickActions.map(({ label, description, icon: Icon, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="group w-full flex items-center gap-3 px-3 sm:px-3.5 py-2.5 sm:py-3 rounded-xl ring-1 ring-transparent hover:ring-gray-200 hover:bg-gray-50 transition-all text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Icon size={16} strokeWidth={2} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {description}
                  </p>
                </div>

                <ArrowRight
                  size={14}
                  className="shrink-0 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}