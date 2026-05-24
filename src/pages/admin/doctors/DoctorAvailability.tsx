import { useEffect, useState } from "react";
import {
  getDoctors,
  saveDoctorAvailability,
  getDoctorAvailability,
  deleteAvailability,
} from "../../../services/adminService";
import DoctorDropdown from "../../../components/DoctorDropdown";
import { Clock, CalendarDays } from "lucide-react";

export default function DoctorAvailability() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);

  const [form, setForm] = useState({
    doctorId: "",
    dayOfWeek: "MONDAY",
    startTime: "",
    endTime: "",
    breakStart: "",
    breakEnd: "",
    slotDuration: 15,
  });

  useEffect(() => {
    getDoctors().then(setDoctors);
  }, []);

  useEffect(() => {
    if (form.doctorId) {
      getDoctorAvailability(Number(form.doctorId)).then(setList);
    }
  }, [form.doctorId]);

  const submit = async () => {
    await saveDoctorAvailability(form);
    getDoctorAvailability(Number(form.doctorId)).then(setList);
  };

  const remove = async (id: number) => {
    await deleteAvailability(id);
    getDoctorAvailability(Number(form.doctorId)).then(setList);
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Doctor Availability
        </h1>
        <p className="text-sm text-gray-500">
          Manage doctor working schedules and slots
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Add / Edit Availability
          </h2>

          {/* Doctor */}
          <div>
            <label className="text-xs text-gray-500">Doctor</label>
            <DoctorDropdown
              doctors={doctors}
              value={form.doctorId}
              onChange={(val) => setForm({ ...form, doctorId: val })}
            />
          </div>

          {/* Day */}
          <div>
            <label className="text-xs text-gray-500">Day</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              value={form.dayOfWeek}
              onChange={(e) =>
                setForm({ ...form, dayOfWeek: e.target.value })
              }
            >
              {[
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY",
              ].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Working Hours */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Working Hours</p>
            <div className="flex gap-3">
              <input
                type="time"
                className="border rounded-lg px-3 py-2 text-sm w-full"
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
              <input
                type="time"
                className="border rounded-lg px-3 py-2 text-sm w-full"
                onChange={(e) =>
                  setForm({ ...form, endTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* Break */}
          <div>
            <p className="text-xs text-gray-500 mb-1">
              Break (Optional)
            </p>
            <div className="flex gap-3">
              <input
                type="time"
                className="border rounded-lg px-3 py-2 text-sm w-full"
                onChange={(e) =>
                  setForm({ ...form, breakStart: e.target.value })
                }
              />
              <input
                type="time"
                className="border rounded-lg px-3 py-2 text-sm w-full"
                onChange={(e) =>
                  setForm({ ...form, breakEnd: e.target.value })
                }
              />
            </div>
          </div>

          {/* Slot */}
          <div>
            <label className="text-xs text-gray-500">
              Slot Duration (mins)
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              value={form.slotDuration}
              onChange={(e) =>
                setForm({
                  ...form,
                  slotDuration: Number(e.target.value),
                })
              }
            />
          </div>

          <button
            onClick={submit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            Save Availability
          </button>
        </div>

        {/* LIST */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Schedule
          </h2>

          {list.length === 0 ? (
            <div className="text-center text-gray-400 py-10 text-sm">
              No availability set
            </div>
          ) : (
            list.map((a) => (
              <div
                key={a.id}
                className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  {/* Day */}
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-gray-800">
                      {a.dayOfWeek}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {formatTime(a.startTime)} -{" "}
                    {formatTime(a.endTime)}
                  </div>

                  {/* Break */}
                  {a.breakStart && (
                    <p className="text-xs text-gray-400 mt-1">
                      Break: {formatTime(a.breakStart)} -{" "}
                      {formatTime(a.breakEnd)}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    {a.slotDuration} mins / slot
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setForm({
                        doctorId: String(a.doctor.id),
                        dayOfWeek: a.dayOfWeek,
                        startTime: a.startTime,
                        endTime: a.endTime,
                        breakStart: a.breakStart || "",
                        breakEnd: a.breakEnd || "",
                        slotDuration: a.slotDuration,
                      })
                    }
                    className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => remove(a.id)}
                    className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}