import { useEffect, useState } from "react";
import { getAppointments } from "../../services/patientService";
import { Calendar, ArrowRight, CalendarCheck, CalendarClock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    const data = await getAppointments();
    setAppointments(Array.isArray(data) ? data : []);
  };

  const total = appointments.length;
  const active = appointments.filter((a) => a.status === "SCHEDULED").length;
  const completed = appointments.filter((a) => a.status === "COMPLETED").length;

  // 🔥 Next upcoming appointment
  const nextAppointment = appointments
    .filter(
      (a) =>
        a.status === "SCHEDULED" &&
        new Date(a.appointmentDate) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
    )[0];

  // 🔥 Recent activity (latest 3)
  const recent = [...appointments]
    .sort(
      (a, b) =>
        new Date(b.appointmentDate).getTime() -
        new Date(a.appointmentDate).getTime()
    )
    .slice(0, 3);

  const badge = (status: string) => {
    if (status === "COMPLETED")
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (status === "SCHEDULED")
      return "bg-blue-50 text-blue-700 border border-blue-200";
    if (status === "CANCELLED")
      return "bg-red-50 text-red-600 border border-red-200";
    return "bg-slate-100 text-slate-600 border border-slate-200";
  };

  // Same 12-hour formatting used across the patient records screens,
  // so dates never render in 24-hour clock time.
  const formatDateTime = (value: string) => {
    const d = new Date(value);
    const datePart = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timePart = d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart} · ${timePart}`;
  };

  return (
    <div className="space-y-5 sm:space-y-6 md:space-y-8">

      {/* KPI STRIP — unified stat bar */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl grid grid-cols-3 divide-x divide-slate-100">
        <Stat
          icon={<Calendar size={14} className="text-slate-500" />}
          iconBg="bg-slate-100"
          label="Total"
          value={total}
        />
        <Stat
          icon={<CalendarClock size={14} className="text-blue-600" />}
          iconBg="bg-blue-50"
          label="Active"
          value={active}
          valueClass="text-blue-700"
        />
        <Stat
          icon={<CalendarCheck size={14} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          label="Completed"
          value={completed}
          valueClass="text-emerald-700"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* NEXT APPOINTMENT */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Next appointment
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Your upcoming scheduled visit
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {nextAppointment ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-base font-semibold shrink-0 shadow-sm shadow-blue-600/20">
                    {nextAppointment.doctorName?.[0]}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {nextAppointment.doctorName}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {nextAppointment.doctorSpecialization}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-500 mt-1.5 flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      {formatDateTime(nextAppointment.appointmentDate)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/patient/appointments")}
                  className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium px-4 py-2.5 shadow-sm shadow-blue-600/20 transition shrink-0"
                >
                  Manage <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6">
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                  <Calendar size={18} className="text-slate-300" />
                </div>
                <p className="text-sm text-slate-400">
                  No upcoming appointments
                </p>
              </div>
            )}
          </div>
        </div>

        {/* QUICK ACTION */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Quick action
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Things you can do right now
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <button
              onClick={() => navigate("/patient/appointments")}
              className="w-full text-left px-4 py-3.5 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition flex justify-between items-center group"
            >
              <span className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-blue-600" />
                </span>
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition">
                  Manage appointments
                </span>
              </span>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100">
          <h3 className="text-sm sm:text-base font-semibold text-slate-900">
            Recent activity
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your latest appointment updates
          </p>
        </div>

        <div className="p-3 sm:p-4">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                <Calendar size={18} className="text-slate-300" />
              </div>
              <p className="text-sm text-slate-400">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map((a) => (
                <div
                  key={a.id}
                  className="flex justify-between items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-sm shadow-blue-600/20">
                      {a.doctorName?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {a.doctorName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDateTime(a.appointmentDate)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${badge(
                      a.status
                    )}`}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- STAT ---------- */
function Stat({
  icon,
  iconBg,
  label,
  value,
  valueClass = "text-slate-900",
}: {
  icon: any;
  iconBg: string;
  label: string;
  value: any;
  valueClass?: string;
}) {
  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`h-7 w-7 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </span>
        <p className="text-xs sm:text-sm text-slate-500">{label}</p>
      </div>
      <p className={`text-2xl sm:text-3xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

export default PatientDashboard;