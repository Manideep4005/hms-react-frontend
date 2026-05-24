import { useEffect, useState } from "react";
import { getAppointments } from "../../services/patientService";
import { Calendar, ArrowRight } from "lucide-react";
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

  // 🔥 Recent activity (latest 4)
  const recent = [...appointments]
    .sort(
      (a, b) =>
        new Date(b.appointmentDate).getTime() -
        new Date(a.appointmentDate).getTime()
    )
    .slice(0, 3);

  const badge = (status: string) => {
    if (status === "COMPLETED")
      return "bg-green-50 text-green-600";
    if (status === "SCHEDULED")
      return "bg-blue-50 text-blue-600";
    if (status === "CANCELLED")
      return "bg-red-50 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your health appointments
          </p>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-3xl font-semibold text-gray-900">{total}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-3xl font-semibold text-blue-600">{active}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-semibold text-green-600">
            {completed}
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NEXT APPOINTMENT */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Next Appointment
          </h3>

          {nextAppointment ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  {nextAppointment.doctorName}
                </p>
                <p className="text-sm text-gray-500">
                  {nextAppointment.doctorSpecialization}
                </p>

                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(
                    nextAppointment.appointmentDate
                  ).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => navigate("/patient/appointments")}
                className="text-sm text-blue-600 hover:underline"
              >
                Manage →
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No upcoming appointments
            </p>
          )}
        </div>

        {/* QUICK ACTION */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Action
          </h3>

          <button
            onClick={() => navigate("/patient/appointments")}
            className="w-full text-left px-4 py-3 rounded-xl border hover:bg-gray-50 transition flex justify-between items-center"
          >
            Manage Appointments
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>

        <div className="space-y-3">
          {recent.map((a) => (
            <div
              key={a.id}
              className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {a.doctorName}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(a.appointmentDate).toLocaleString()}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full ${badge(
                  a.status
                )}`}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;