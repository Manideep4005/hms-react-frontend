import { useEffect, useState } from "react";
import { getPatients } from "../../services/adminService";
import { Search, ArrowRight, Mail, Phone } from "lucide-react";
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
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
            Patients
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage and explore patient records
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient..."
            className="border pl-9 pr-3 py-2 text-sm rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* DESKTOP TABLE VIEW - hidden on mobile */}
      <div className="hidden md:block bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3 text-left">Patient</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Mobile</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    Loading patients...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    No patients found
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-gray-50 transition group"
                  >
                    {/* PATIENT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold">
                          {p.firstName?.[0]}
                        </div>

                        <div>
                          <div className="font-medium text-gray-900">
                            {p.firstName} {p.lastName}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {p.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-5 py-4 text-gray-600">
                      {p.email || "-"}
                    </td>

                    {/* MOBILE */}
                    <td className="px-5 py-4 text-gray-600">
                      {p.mobileNumber}
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          navigate(`/admin/patient/${Number(p.id)}/details`)
                        }
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline opacity-80 group-hover:opacity-100 transition"
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
          <div className="flex justify-center items-center h-[300px] text-gray-500">
            Loading patients...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center text-gray-500">
            No patients found
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border p-4 hover:shadow-md transition"
            >
              {/* Header with Avatar and Name */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-semibold shrink-0">
                  {p.firstName?.[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    ID: {p.id}
                  </div>
                </div>
              </div>

              {/* Patient Details */}
              <div className="mt-3 space-y-2 pt-3 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600 truncate">
                    {p.email || "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600">{p.mobileNumber}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2">
                <button
                  onClick={() =>
                    navigate(`/admin/patient/${Number(p.id)}/details`)
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition"
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