import { useEffect, useState } from "react";
import { getPatients } from "../../services/adminService";
import { Search, ArrowRight, Mail, Phone, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Patients() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const res = await getPatients();
    setData(res);
    setLoading(false);
  };

  const filtered = data.filter((p) =>
    `${p.firstName} ${p.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold tracking-wide text-blue-600 uppercase mb-1">
            Patient records
          </p>
          {/* <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Patients
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage and explore patient records
          </p> */}
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient..."
            className="border border-slate-300 bg-white pl-9 pr-9 py-2.5 text-sm rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* SUMMARY STRIP */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm">
          <div className="h-6 w-6 rounded-md bg-blue-50 flex items-center justify-center">
            <Users size={13} className="text-blue-600" />
          </div>
          <span className="text-xs sm:text-sm text-slate-600">
            <span className="font-semibold text-slate-900">
              {data.length}
            </span>{" "}
            total patients
          </span>
        </div>
        {search && (
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2">
            <span className="text-xs sm:text-sm text-blue-700">
              <span className="font-semibold">{filtered.length}</span>{" "}
              matching "{search}"
            </span>
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW - hidden on mobile */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Patient</th>
                <th className="px-5 py-3 text-left font-semibold">Email</th>
                <th className="px-5 py-3 text-left font-semibold">Mobile</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-14">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <div className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
                      <span className="text-sm">Loading patients...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-14">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
                        <Users size={18} className="text-slate-300" />
                      </div>
                      <span className="text-sm">No patients found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-slate-100 hover:bg-slate-50/70 transition group"
                  >
                    {/* PATIENT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-sm shadow-blue-600/20">
                          {p.firstName?.[0]}
                        </div>

                        <div>
                          <div className="font-medium text-slate-900">
                            {p.firstName} {p.lastName}
                          </div>
                          <div className="text-xs text-slate-400">
                            ID: {p.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-5 py-4 text-slate-600">
                      {p.email || "-"}
                    </td>

                    {/* MOBILE */}
                    <td className="px-5 py-4 text-slate-600">
                      {p.mobileNumber}
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          navigate(`/admin/patient/${Number(p.id)}/details`)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 opacity-80 group-hover:opacity-100 transition"
                      >
                        View <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARD VIEW - visible only on mobile/tablet */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[300px] gap-2 text-slate-400">
            <div className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
            <span className="text-sm">Loading patients...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-2">
              <Users size={18} className="text-slate-300" />
            </div>
            <span className="text-sm text-slate-400">No patients found</span>
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition"
            >
              {/* Header with Avatar and Name */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-base font-semibold shrink-0 shadow-sm shadow-blue-600/20">
                  {p.firstName?.[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    ID: {p.id}
                  </div>
                </div>
              </div>

              {/* Patient Details */}
              <div className="mt-3 space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span className="text-slate-600 truncate">
                    {p.email || "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <span className="text-slate-600">{p.mobileNumber}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2">
                <button
                  onClick={() =>
                    navigate(`/admin/patient/${Number(p.id)}/details`)
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm shadow-blue-600/20 transition"
                >
                  View Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}