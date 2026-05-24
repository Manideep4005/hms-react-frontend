import { useEffect, useState } from "react";
import {
  getDoctorAppointments,
  completeAppointment,
} from "../../services/doctorService";


function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusBadge(status: string) {
  if (status === "COMPLETED") return "bg-green-100 text-green-600";
  if (status === "SCHEDULED") return "bg-blue-100 text-blue-600";
  return "bg-gray-100 text-gray-600";
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("TODAY");

  const [form, setForm] = useState({
    remarks: "",
    prescription: "",
    needsReview: false,
    reviewTimeperiod: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getDoctorAppointments();
    setAppointments(res.data);
  };

  const handleComplete = async () => {
    if (!form.remarks || !form.prescription) {
      setError("Remarks & Prescription required");
      return;
    }

    await completeAppointment(selected.id, form);
    setSelected(null);
    setForm({
      remarks: "",
      prescription: "",
      needsReview: false,
      reviewTimeperiod: "",
    });
    load();
  };

  const today = new Date().toDateString();

  let filtered = appointments.filter((a) =>
    a.patientName.toLowerCase().includes(search.toLowerCase()),
  );

  if (tab === "TODAY") {
    filtered = filtered.filter(
      (a) => new Date(a.appointmentDate).toDateString() === today,
    );
  }

  if (tab === "UPCOMING") {
    filtered = filtered.filter(
      (a) =>
        new Date(a.appointmentDate) > new Date() && a.status === "SCHEDULED",
    );
  }

  if (tab === "COMPLETED") {
    filtered = filtered.filter((a) => a.status === "COMPLETED");
  }

  return (
    <div>
      {/* HEADER */}
      < div className="flex justify-between items-center mb-6" >
        <h2 className="text-2xl font-semibold">Appointments</h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search patient..."
          className="border px-3 py-2 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div >

      {/* TABS */}
      < div className="flex gap-3 mb-6" >
        {
          ["ALL", "TODAY", "UPCOMING", "COMPLETED"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm ${tab === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
            >
              {t}
            </button>
          ))
        }
      </div >

      {/* LIST */}
      < div className="bg-white rounded-xl border border-gray-200 overflow-hidden" >
        {
          filtered.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No appointments found</p>
          ) : (
            filtered.map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-center px-5 py-4 border-t first:border-0 hover:bg-gray-50 transition"
              >
                {/* LEFT */}
                <div>
                  <p className="font-medium text-gray-800">{a.patientName}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(a.appointmentDate)}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${statusBadge(
                      a.status,
                    )}`}
                  >
                    {a.status}
                  </span>

                  {a.status === "SCHEDULED" && (
                    <button
                      onClick={() => setSelected(a)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )
        }
      </div >

      {/* MODAL */}
      {
        selected && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-[420px] rounded-2xl p-6 relative shadow-xl">
              <button
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 text-gray-400"
              >
                ✕
              </button>

              <h3 className="text-lg font-semibold mb-4">Complete Appointment</h3>

              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

              <textarea
                placeholder="Remarks *"
                className="w-full border rounded-lg p-2 mb-3"
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              />

              <textarea
                placeholder="Prescription *"
                className="w-full border rounded-lg p-2 mb-3"
                value={form.prescription}
                onChange={(e) =>
                  setForm({ ...form, prescription: e.target.value })
                }
              />

              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={form.needsReview}
                  onChange={(e) =>
                    setForm({ ...form, needsReview: e.target.checked })
                  }
                />
                <label className="text-sm">Needs Review</label>
              </div>

              {form.needsReview && (
                <input
                  type="text"
                  placeholder="Review Time (e.g. 7 days)"
                  className="w-full border rounded-lg p-2 mb-3"
                  value={form.reviewTimeperiod}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      reviewTimeperiod: e.target.value,
                    })
                  }
                />
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 border rounded-lg py-2"
                >
                  Cancel
                </button>

                <button
                  onClick={handleComplete}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )
      }</div>
  );
}
