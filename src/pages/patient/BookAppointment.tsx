import { useEffect, useState, useRef } from "react";
import {
  getDoctors,
  getDoctorAvailability,
  getDoctorSlots,
  bookAppointment,
} from "../../services/patientService";

/* ================= TYPES ================= */

interface Doctor {
  userId: number;
  firstName: string;
  lastName: string;
  specialization: string;
  yearsOfExperience?: number;
  consultationFee?: number;
}

interface Availability {
  dayOfWeek: string;
}

interface Slot {
  time: string;
  available: boolean;
}

/* ================= COMPONENT ================= */

export default function BookAppointment() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [doctorSearch, setDoctorSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [slots, setSlots] = useState<Slot[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  /* ================= LOAD DOCTORS ================= */

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        setDoctors(Array.isArray(res) ? res : []);
      } catch {
        setError("Failed to load doctors");
      }
    };

    fetchDoctors();
  }, []);

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= FILTER ================= */

  const filteredDoctors = doctors.filter((d) =>
    `${d.firstName} ${d.lastName} ${d.specialization}`
      .toLowerCase()
      .includes(doctorSearch.toLowerCase()),
  );

  /* ================= LOAD SLOTS ================= */

  const loadSlots = async (docId: number, date: string) => {
    try {
      setLoadingSlots(true);
      const res = await getDoctorSlots(docId, date);
      setSlots(Array.isArray(res) ? res : []);
    } catch {
      setSlots([]);
      setError("Failed to load slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  /* ================= HANDLE DOCTOR ================= */

  const handleDoctorSelect = async (doc: Doctor) => {
    setError("");
    setSuccess("");

    setDoctorId(doc.userId);
    setSelectedDoctor(doc);

    setIsOpen(false);
    setDoctorSearch("");

    try {
      const res: Availability[] = await getDoctorAvailability(doc.userId);
      setAvailableDays(res.map((a) => a.dayOfWeek));
    } catch {
      setAvailableDays([]);
      setError("Failed to load availability");
    }

    setSelectedDate("");
    setSlots([]);
    setAppointmentDate("");
  };

  /* ================= HANDLE DATE ================= */

  const handleDateChange = (date: string) => {
    setError("");

    if (!doctorId) {
      setError("Please select doctor first");
      return;
    }

    const day = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    if (!availableDays.includes(day)) {
      setError(`Doctor not available on ${day}`);
      setSlots([]);
      setSelectedDate(date);
      return;
    }

    setSelectedDate(date);
    loadSlots(doctorId, date);
  };

  /* ================= SUBMIT ================= */

  const submit = async () => {
    setError("");
    setSuccess("");

    if (!doctorId) return setError("Select doctor");
    if (!appointmentDate) return setError("Select slot");

    try {
      setLoading(true);

      await bookAppointment({
        doctorId,
        appointmentDate,
      });

      setSuccess("Appointment booked");

      setDoctorId(null);
      setSelectedDoctor(null);
      setSelectedDate("");
      setSlots([]);
      setAppointmentDate("");
      setAvailableDays([]);
    } catch {
      setError("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SLOT HELPERS ================= */

  const isPastSlot = (time: string) => new Date(time) < new Date();

  const getSlotStatus = (slot: Slot) => {
    if (isPastSlot(slot.time)) return "PAST";
    if (!slot.available) return "BOOKED";
    return "AVAILABLE";
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Book Appointment</h1>

      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        {/* 🔥 SEARCHABLE DROPDOWN (REPLACED SELECT) */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="w-full border px-4 py-3 rounded-lg cursor-pointer flex justify-between items-center"
          >
            <div>
              {selectedDoctor ? (
                <>
                  <p className="font-medium">
                    Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedDoctor.specialization}
                  </p>
                </>
              ) : (
                <span className="text-gray-400">Search & Select Doctor</span>
              )}
            </div>
            <span>▼</span>
          </div>

          {isOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow">
              <input
                className="w-full px-3 py-2 border-b"
                placeholder="Search..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
              />

              <div className="max-h-60 overflow-y-auto rounded-lg border shadow-sm bg-white">
                {filteredDoctors.map((d) => (
                  <div
                    key={d.userId}
                    onClick={() => handleDoctorSelect(d)}
                    className="flex items-center justify-between gap-3 p-3 border-b hover:bg-gray-50 cursor-pointer transition"
                  >
                    {/* Left Section */}
                    <div>
                      <p className="font-semibold text-gray-800">
                        Dr. {d.firstName} {d.lastName}
                      </p>

                      <p className="text-sm text-blue-600 font-medium">
                        {d.specialization}
                      </p>

                      <p className="text-xs text-gray-500">
                        {d.yearsOfExperience} yrs experience
                      </p>
                    </div>

                    {/* Right Section */}
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                        ₹{d.consultationFee}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredDoctors.length === 0 && (
                  <p className="p-4 text-sm text-gray-400 text-center">
                    No doctors found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Available Days */}
        {availableDays.length > 0 && (
          <p className="text-sm text-gray-500">
            Available on: {availableDays.join(", ")}
          </p>
        )}

        {/* Date */}
        <input
          type="date"
          className="w-full border p-3 rounded-lg"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
        />

        {/* Legend */}
        <div className="flex gap-4 text-xs">
          <span className="text-blue-600">■ Available</span>
          <span className="text-red-500">■ Booked</span>
          <span className="text-gray-400">■ Past</span>
        </div>

        {/* Slots */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
          {loadingSlots ? (
            <p className="col-span-full text-center text-gray-400">
              Loading slots...
            </p>
          ) : slots.length > 0 ? (
            slots.map((s) => {
              const status = getSlotStatus(s);
              const formatted = new Date(s.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <button
                  key={s.time}
                  disabled={status !== "AVAILABLE"}
                  onClick={() => setAppointmentDate(s.time)}
                  className={`
                      relative border rounded-xl py-2 text-sm 
                      ${status === "AVAILABLE"
                      ? appointmentDate === s.time
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-50"
                      : status === "BOOKED"
                        ? "bg-red-50 text-red-500 cursor-not-allowed"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                    `}
                >
                  {formatted}

                  {status === "BOOKED" && (
                    <span className="absolute top-1 right-1 text-[10px] bg-red-500 text-white px-1 rounded">
                      Booked
                    </span>
                  )}

                  {status === "PAST" && (
                    <span className="absolute top-1 right-1 text-[10px] bg-gray-400 text-white px-1 rounded">
                      Past
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-400">
              No slots available
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </div>


    </div>
  );
}
