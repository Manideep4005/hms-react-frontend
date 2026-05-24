import { useEffect, useState } from "react";
import { getPatients } from "../../services/adminService";
import { Search, ArrowRight } from "lucide-react";
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
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Patients
          </h1>
          <p className="text-sm text-gray-500">
            Manage and explore patient records
          </p>
        </div>

        {/* 🔥 SEARCH */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient..."
            className="border pl-9 pr-3 py-2.5 text-sm rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 🔥 TABLE CARD */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
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
                  <td className="px-5 py-4 flex items-center gap-3">
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
  );
}