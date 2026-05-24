import { useEffect, useState } from "react";
import {
  getAllAppointments,
  getTodayAppointments,
  getFutureAppointments,
  getPastAppointments,
  deleteAppointment,
} from "../../services/adminService";
import { Search } from "lucide-react";
import ModalPortal from "../../components/ModalPortal";

export default function Appointments() {
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [counts, setCounts] = useState({
    all: 0,
    today: 0,
    future: 0,
    past: 0,
  });

  useEffect(() => {
    load();
  }, [tab]);

  useEffect(() => {
    handleSearch();
  }, [search, data]);

  const load = async () => {
    setLoading(true);

    const [all, today, future, past] = await Promise.all([
      getAllAppointments(),
      getTodayAppointments(),
      getFutureAppointments(),
      getPastAppointments(),
    ]);

    setCounts({
      all: all.length,
      today: today.length,
      future: future.length,
      past: past.length,
    });

    let res;
    if (tab === "today") res = today;
    else if (tab === "future") res = future;
    else if (tab === "past") res = past;
    else res = all;

    setData(res);
    setFiltered(res);
    setLoading(false);
  };

  const handleSearch = () => {
    const val = search.toLowerCase();

    setFiltered(
      data.filter(
        (a) =>
          a.patientName?.toLowerCase().includes(val) ||
          a.doctorName?.toLowerCase().includes(val) ||
          a.mobile?.toLowerCase().includes(val)
      )
    );
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteAppointment(deleteId);
    setDeleteId(null);
    load();
  };

  const badge = (status: string) => {
    if (status === "COMPLETED")
      return "bg-green-50 text-green-600";
    if (status === "CANCELLED")
      return "bg-red-50 text-red-600";
    return "bg-yellow-50 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Appointments
        </h1>

        <div className="relative w-[260px]">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border rounded-xl text-sm w-full focus:ring-2 focus:ring-gray-900 outline-none"
          />
        </div>
      </div>

      {/* TABS WITH COUNTS */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: "all", label: "All" },
          { key: "today", label: "Today" },
          { key: "future", label: "Future" },
          { key: "past", label: "Past" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 text-sm rounded-lg transition flex items-center gap-2 ${tab === t.key
              ? "bg-white shadow text-gray-900"
              : "text-gray-500 hover:text-gray-800"
              }`}
          >
            {t.label}
            <span className="text-xs text-gray-400">
              {counts[t.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {loading && (
          <div className="text-center py-10 text-gray-400">
            Loading appointments...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No appointments found
          </div>
        )}

        {filtered.map((a) => (
          <div
            key={a.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition"
          >
            {/* LEFT */}
            <div>
              <p className="font-medium text-gray-900">
                {a.patientName}
              </p>

              <p className="text-sm text-gray-500">
                {a.doctorName} • {a.doctorSpecialization}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {new Date(a.appointmentDate).toLocaleString()}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 text-xs rounded-full ${badge(
                  a.status
                )}`}
              >
                {a.status}
              </span>

              <button
                onClick={() => setDeleteId(a.id)}
                className="text-sm text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <ModalPortal>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white w-[400px] rounded-2xl p-6 shadow-xl text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Appointment?
              </h3>

              <p className="text-sm text-gray-500 mb-5">
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 border rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}