import { useEffect, useState } from "react";
import {
  getDoctors,
  saveDoctorAvailability,
  getDoctorAvailability,
  deleteAvailability,
} from "../../../services/adminService";
import DoctorDropdown from "../../../components/DoctorDropdown";
import { Clock, CalendarDays, Pencil, Trash2, X, CalendarClock } from "lucide-react";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const EMPTY_FORM = {
  doctorId: "",
  dayOfWeek: "MONDAY",
  startTime: "",
  endTime: "",
  breakStart: "",
  breakEnd: "",
  slotDuration: 15,
};

export default function DoctorAvailability() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    getDoctors().then(setDoctors);
  }, []);

  useEffect(() => {
    if (form.doctorId) {
      refreshList();
    } else {
      setList([]);
    }
  }, [form.doctorId]);

  const refreshList = async () => {
    setLoadingList(true);
    const data = await getDoctorAvailability(Number(form.doctorId));
    setList(data);
    setLoadingList(false);
  };

  const submit = async () => {
    setSaving(true);
    try {
      await saveDoctorAvailability(form);
      await refreshList();
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    await deleteAvailability(id);
    if (editingId === id) cancelEdit();
    refreshList();
  };

  const startEdit = (a: any) => {
    setEditingId(a.id);
    setForm({
      doctorId: String(a.doctor.id),
      dayOfWeek: a.dayOfWeek,
      startTime: a.startTime,
      endTime: a.endTime,
      breakStart: a.breakStart || "",
      breakEnd: a.breakEnd || "",
      slotDuration: a.slotDuration,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm((f) => ({ ...EMPTY_FORM, doctorId: f.doctorId }));
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const dayLabel = (d: string) =>
    d.charAt(0) + d.slice(1).toLowerCase();

  const canSubmit =
    form.doctorId && form.startTime && form.endTime && !saving;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
          Doctor Availability
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage doctor working schedules and slots
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* FORM */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl ring-1 ring-gray-200 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {editingId ? "Edit Availability" : "Add Availability"}
            </h2>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X size={13} />
                Cancel edit
              </button>
            )}
          </div>

          {/* Doctor */}
          <div>
            <label className="text-xs font-medium text-gray-500">
              Doctor
            </label>
            <div className="mt-1">
              <DoctorDropdown
                doctors={doctors}
                value={form.doctorId}
                onChange={(val) => setForm({ ...form, doctorId: val })}
              />
            </div>
          </div>

          {/* Day */}
          <div>
            <label className="text-xs font-medium text-gray-500">Day</label>
            <select
              className="w-full ring-1 ring-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={form.dayOfWeek}
              onChange={(e) =>
                setForm({ ...form, dayOfWeek: e.target.value })
              }
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {dayLabel(d)}
                </option>
              ))}
            </select>
          </div>

          {/* Working Hours */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">
              Working Hours
            </p>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={form.startTime}
                className="ring-1 ring-gray-200 rounded-xl px-3 py-2.5 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
              <span className="text-xs text-gray-400 shrink-0">to</span>
              <input
                type="time"
                value={form.endTime}
                className="ring-1 ring-gray-200 rounded-xl px-3 py-2.5 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                onChange={(e) =>
                  setForm({ ...form, endTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* Break */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">
              Break <span className="text-gray-400">(optional)</span>
            </p>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={form.breakStart}
                className="ring-1 ring-gray-200 rounded-xl px-3 py-2.5 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                onChange={(e) =>
                  setForm({ ...form, breakStart: e.target.value })
                }
              />
              <span className="text-xs text-gray-400 shrink-0">to</span>
              <input
                type="time"
                value={form.breakEnd}
                className="ring-1 ring-gray-200 rounded-xl px-3 py-2.5 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                onChange={(e) =>
                  setForm({ ...form, breakEnd: e.target.value })
                }
              />
            </div>
          </div>

          {/* Slot */}
          <div>
            <label className="text-xs font-medium text-gray-500">
              Slot Duration (mins)
            </label>
            <input
              type="number"
              min={5}
              step={5}
              className="w-full ring-1 ring-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
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
            disabled={!canSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Availability"
                : "Save Availability"}
          </button>
        </div>

        {/* LIST */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl ring-1 ring-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Schedule
            </h2>
            {!loadingList && list.length > 0 && (
              <span className="text-xs font-medium text-gray-400">
                {list.length} {list.length === 1 ? "entry" : "entries"}
              </span>
            )}
          </div>

          {!form.doctorId ? (
            <div className="flex flex-col items-center gap-2 text-center py-14">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                <CalendarClock size={20} />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Select a doctor
              </p>
              <p className="text-xs text-gray-400">
                Their weekly schedule will appear here.
              </p>
            </div>
          ) : loadingList ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="ring-1 ring-gray-100 rounded-xl p-4 space-y-2"
                >
                  <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                  <div className="h-3 w-36 rounded bg-gray-100 animate-pulse" />
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center gap-2 text-center py-14">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                <CalendarDays size={20} />
              </div>
              <p className="text-sm font-medium text-gray-700">
                No availability set
              </p>
              <p className="text-xs text-gray-400">
                Add working hours using the form.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {list.map((a) => {
                const isEditing = editingId === a.id;
                return (
                  <div
                    key={a.id}
                    className={`rounded-xl p-4 flex justify-between items-center transition-colors ${isEditing
                        ? "ring-2 ring-blue-500 bg-blue-50/40"
                        : "ring-1 ring-gray-100 hover:bg-gray-50"
                      }`}
                  >
                    <div className="min-w-0">
                      {/* Day */}
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarDays className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="text-sm font-semibold text-gray-900">
                          {dayLabel(a.dayOfWeek)}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                        {formatTime(a.startTime)} - {formatTime(a.endTime)}
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
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => startEdit(a)}
                        className="p-2 text-blue-600 rounded-lg hover:bg-blue-100/60 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => remove(a.id)}
                        className="p-2 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}