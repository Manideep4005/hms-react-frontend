import { useEffect, useState, useRef } from "react";
import {
  createGuestAppointment,
  getDoctorAvailability,
  getDoctors,
  getDoctorSlots,
} from "../../services/adminService";

interface Slot {
  time: string;
  available: boolean;
}

export default function GuestAppointment() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    doctorId: "",
    appointmentDate: "",
  });

  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [slots, setSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getDoctors().then((res) => {
      setDoctors(Array.isArray(res) ? res : []);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDoctors = doctors.filter((d) =>
    `${d.firstName} ${d.lastName} ${d.specialization}`
      .toLowerCase()
      .includes(doctorSearch.toLowerCase())
  );

  const selectedDoctor = doctors.find(
    (d) => String(d.userId) === form.doctorId
  );

  const loadSlots = async (doctorId: number, date: string) => {
    try {
      const res = await getDoctorSlots(doctorId, date);
      setSlots(Array.isArray(res) ? res : []);
    } catch {
      setSlots([]);
    }
  };

  const submit = async () => {
    if (
      !form.firstName.trim() ||
      !form.mobileNumber.trim() ||
      !form.doctorId ||
      !form.appointmentDate
    ) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createGuestAppointment({
        ...form,
        doctorId: Number(form.doctorId),
      });

      setSuccess("Appointment booked successfully");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        doctorId: "",
        appointmentDate: "",
      });

      setDoctorSearch("");
      setSlots([]);
      setSelectedDate("");
      setAvailableDays([]);
    } catch {
      setError("Failed to book appointment");
    }

    setLoading(false);
  };

  const isPastSlot = (time: string) => new Date(time) < new Date();

  const getStatus = (slot: Slot) => {
    if (isPastSlot(slot.time)) return "PAST";
    if (!slot.available) return "BOOKED";
    return "AVAILABLE";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h1 className="text-xl font-semibold text-gray-800 mb-5">
          Book Guest Appointment
        </h1>

        {/* Patient Details */}
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Patient Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <input
            className="border px-3 py-2 rounded-lg text-sm"
            placeholder="First Name *"
            value={form.firstName}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
          />

          <input
            className="border px-3 py-2 rounded-lg text-sm"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
          />

          <input
            className="md:col-span-2 border px-3 py-2 rounded-lg text-sm"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className="md:col-span-2 border px-3 py-2 rounded-lg text-sm"
            placeholder="Mobile Number *"
            value={form.mobileNumber}
            onChange={(e) =>
              setForm({
                ...form,
                mobileNumber: e.target.value,
              })
            }
          />
        </div>

        {/* Appointment Details */}
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Appointment Details
        </h3>

        {/* Doctor Dropdown */}
        <div className="mb-4 relative" ref={dropdownRef}>
          <label className="block text-xs text-gray-600 mb-2">
            Select Doctor *
          </label>

          <div
            onClick={() => setIsOpen(!isOpen)}
            className="border rounded-lg px-3 py-2 cursor-pointer flex justify-between items-center"
          >
            {selectedDoctor ? (
              <div>
                <p className="font-medium text-sm text-gray-800">
                  Dr. {selectedDoctor.firstName}{" "}
                  {selectedDoctor.lastName}
                </p>

                <p className="text-xs text-gray-500">
                  {selectedDoctor.specialization}
                </p>

                <p className="text-xs text-blue-600 mt-1">
                  ₹{selectedDoctor.consultationFee}
                </p>
              </div>
            ) : (
              <span className="text-sm text-gray-400">
                Search & Select Doctor
              </span>
            )}

            <span className="text-xs text-gray-500">▼</span>
          </div>

          {isOpen && (
            <div className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
              <input
                className="w-full px-3 py-2 border-b text-sm outline-none"
                placeholder="Search doctor..."
                value={doctorSearch}
                onChange={(e) =>
                  setDoctorSearch(e.target.value)
                }
              />

              <div className="max-h-72 overflow-y-auto">
                {filteredDoctors.map((d) => (
                  <div
                    key={d.userId}
                    onClick={async () => {
                      setForm({
                        ...form,
                        doctorId: String(d.userId),
                      });

                      setIsOpen(false);
                      setDoctorSearch("");
                      setSlots([]);
                      setSelectedDate("");

                      const res =
                        await getDoctorAvailability(d.userId);

                      const days = res.map(
                        (a: any) => a.dayOfWeek
                      );

                      setAvailableDays(days);
                    }}
                    className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="font-medium text-sm">
                      Dr. {d.firstName} {d.lastName}
                    </p>

                    <p className="text-xs text-gray-500">
                      {d.specialization}
                    </p>

                    <p className="text-xs text-gray-400">
                      {d.yearsOfExperience} yrs exp •{" "}
                      {d.education}
                    </p>

                    <p className="text-xs text-blue-600 mt-1">
                      ₹{d.consultationFee}
                    </p>
                  </div>
                ))}

                {filteredDoctors.length === 0 && (
                  <p className="p-3 text-center text-sm text-gray-400">
                    No doctors found
                  </p>
                )}
              </div>
            </div>
          )}

          {availableDays.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Available on: {availableDays.join(", ")}
            </p>
          )}
        </div>

        {/* Date */}
        <input
          type="date"
          className="w-full border px-3 py-2 rounded-lg text-sm mb-4"
          value={selectedDate}
          onChange={(e) => {
            const date = e.target.value;

            const day = new Date(date)
              .toLocaleDateString("en-US", {
                weekday: "long",
              })
              .toUpperCase();

            if (!availableDays.includes(day)) {
              setError(`Doctor not available on ${day}`);
              setSlots([]);
              setSelectedDate(date);
              return;
            }

            setError("");
            setSelectedDate(date);

            if (form.doctorId) {
              loadSlots(Number(form.doctorId), date);
            }
          }}
        />

        {/* Legend */}
        <div className="flex gap-4 text-[11px] mb-3">
          <span className="text-blue-600">■ Available</span>
          <span className="text-red-500">■ Booked</span>
          <span className="text-gray-400">■ Past</span>
        </div>

        {/* Slots */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {slots.map((s: any) => {
            const status = getStatus(s);

            const formatted = new Date(
              s.time
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <button
                key={s.time}
                disabled={status !== "AVAILABLE"}
                onClick={() =>
                  setForm({
                    ...form,
                    appointmentDate: s.time,
                  })
                }
                className={`relative rounded-lg border py-2 text-xs font-medium transition

                ${status === "AVAILABLE"
                    ? form.appointmentDate === s.time
                      ? "bg-blue-600 text-white border-blue-600"
                      : "hover:bg-blue-50"
                    : status === "BOOKED"
                      ? "bg-red-50 text-red-500 border-red-200 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
              >
                {formatted}

                {status === "BOOKED" && (
                  <span className="absolute top-1 right-1 text-[9px] bg-red-500 text-white px-1 rounded">
                    Booked
                  </span>
                )}

                {status === "PAST" && (
                  <span className="absolute top-1 right-1 text-[9px] bg-gray-500 text-white px-1 rounded">
                    Past
                  </span>
                )}
              </button>
            );
          })}

          {slots.length === 0 && (
            <p className="col-span-full text-center text-sm text-gray-400 py-3">
              No slots available
            </p>
          )}
        </div>

        {/* Fee */}
        {selectedDoctor && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-gray-600 mb-1">
              Consultation Fee
            </p>

            <p className="text-lg font-semibold text-blue-700">
              ₹{selectedDoctor.consultationFee}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium"
        >
          {loading ? "Booking..." : "Confirm Appointment"}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm mt-3">
            {success}
          </p>
        )}
      </div>
    </div>
  );
}