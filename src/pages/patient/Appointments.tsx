import { useEffect, useState } from "react";
import {
  getAppointments,
  cancelAppointment,
  getDoctorSlots,
  editAppointment,
} from "../../services/patientService";
import { Calendar, User } from "lucide-react";
import ModalPortal from "../../components/ModalPortal";

/* ================= TYPES ================= */

interface Appointment {
  id: number;
  appointmentDate: string;
  status: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorId: number;
}

interface Slot {
  time: string;
  available: boolean;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  /* 🔒 LOCK BODY SCROLL WHEN MODAL OPEN */
  useEffect(() => {
    if (editing || confirmCancelId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editing, confirmCancelId]);

  const load = async () => {
    setLoading(true);
    const data = await getAppointments();
    setAppointments(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const cancel = async () => {
    if (!confirmCancelId) return;
    await cancelAppointment(confirmCancelId);
    setConfirmCancelId(null);
    load();
  };

  const loadSlots = async (doctorId: number, date: string) => {
    const res = await getDoctorSlots(doctorId, date);
    setSlots(Array.isArray(res) ? res : []);
  };

  const saveReschedule = async () => {
    if (!editing || !selectedSlot) return;

    await editAppointment(editing.id, {
      doctorId: editing.doctorId,
      appointmentDate: selectedSlot,
    });

    setEditing(null);
    setSlots([]);
    setSelectedSlot("");
    setNewDate("");
    load();
  };

  const isPast = (time: string) => new Date(time) < new Date();

  const badge = (status: string) => {
    if (status === "COMPLETED")
      return "bg-green-50 text-green-600 border-green-200";
    if (status === "SCHEDULED")
      return "bg-blue-50 text-blue-600 border-blue-200";
    return "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          My Appointments
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track your bookings
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-10 text-gray-400">
            Loading appointments...
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No appointments found
          </div>
        )}

        {appointments.map((a) => (
          <div
            key={a.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition"
          >
            <div className="space-y-1">
              <p className="font-medium text-gray-900 flex items-center gap-2">
                <User size={16} /> {a.doctorName}
              </p>
              <p className="text-sm text-gray-500">
                {a.doctorSpecialization}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar size={14} />
                {new Date(a.appointmentDate).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 text-xs rounded-full border ${badge(
                  a.status
                )}`}
              >
                {a.status}
              </span>

              {a.status === "SCHEDULED" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmCancelId(a.id)}
                    className="text-sm px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      setEditing(a);
                      setNewDate("");
                      setSlots([]);
                      setSelectedSlot("");
                    }}
                    className="text-sm px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  >
                    Reschedule
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= RESCHEDULE MODAL ================= */}
      {editing && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
            <div
              className="absolute inset-0"
              onClick={() => setEditing(null)}
            />

            <div className="relative bg-white w-[520px] max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">
                  Reschedule Appointment
                </h3>
                <p className="text-xs text-gray-500">
                  {editing.doctorName} • {editing.doctorSpecialization}
                </p>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <input
                  type="date"
                  className="w-full border rounded-xl p-2"
                  value={newDate}
                  onChange={(e) => {
                    const d = e.target.value;
                    setNewDate(d);
                    loadSlots(editing.doctorId, d);
                  }}
                />

                <div className="grid grid-cols-3 gap-3">
                  {slots.map((s) => {
                    const past = isPast(s.time);
                    const disabled = !s.available || past;

                    return (
                      <button
                        key={s.time}
                        disabled={disabled}
                        onClick={() => setSelectedSlot(s.time)}
                        className={`py-3 rounded-xl border text-sm
                          ${selectedSlot === s.time && !disabled
                            ? "bg-gray-700 text-white hover:bg-gray-800"
                            : ""
                          }
                          ${disabled
                            ? "opacity-40 line-through cursor-not-allowed"
                            : "hover:bg-gray-50"
                          }
                        `}
                      >
                        {new Date(s.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-6 py-4 border-t flex justify-end gap-3">
                <button onClick={() => setEditing(null)}>Cancel</button>
                <button
                  onClick={saveReschedule}
                  disabled={!selectedSlot}
                  className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ================= CANCEL MODAL ================= */}
      {confirmCancelId && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
            <div
              className="absolute inset-0"
              onClick={() => setConfirmCancelId(null)}
            />

            <div className="relative bg-white w-[380px] rounded-2xl p-6 text-center shadow-xl">
              <h3 className="text-lg font-semibold text-red-600">
                Cancel Appointment?
              </h3>

              <p className="text-sm text-gray-500 mt-2 mb-5">
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3">
                <button onClick={() => setConfirmCancelId(null)}>
                  No
                </button>
                <button
                  onClick={cancel}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}