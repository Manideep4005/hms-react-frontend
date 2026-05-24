import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  Stethoscope,
  Search,
  Filter,
} from "lucide-react";

import { getDoctors, deleteDoctor } from "../../../services/adminService";

export default function Doctors() {
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const res = await getDoctors();
      setData(res || []);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedDoctor(null);
    setShowDeleteModal(false);
  };

  const removeDoctor = async () => {
    if (!selectedDoctor) return;

    await deleteDoctor(selectedDoctor.userId);
    closeDeleteModal();
    loadDoctors();
  };

  /* unique specialization list */
  const specializationOptions = useMemo(() => {
    const items = data
      .map((d) => d.specialization)
      .filter(Boolean)
      .map((s) => s.trim());

    return [...new Set(items)].sort();
  }, [data]);

  /* filtered doctors */
  const filteredDoctors = useMemo(() => {
    return data.filter((d) => {
      const fullName =
        `${d.firstName || ""} ${d.lastName || ""}`.toLowerCase();

      const email = (d.email || "").toLowerCase();

      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase());

      const matchesSpecialization =
        specialization === "" ||
        d.specialization?.toLowerCase() === specialization.toLowerCase();

      return matchesSearch && matchesSpecialization;
    });
  }, [data, search, specialization]);

  if (loading) {
    return (
      <div className="h-[260px] flex items-center justify-center text-sm text-gray-500">
        Loading doctors...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Doctors</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage doctors and profiles
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/doctors/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Add Doctor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl shadow-sm p-3 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-9 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full border rounded-lg pl-9 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 appearance-none bg-white"
            >
              <option value="">All Specializations</option>

              {specializationOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setSearch("");
              setSpecialization("");
            }}
            className="border rounded-lg px-4 py-1.5 text-sm hover:bg-gray-50 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {filteredDoctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mb-3">
              <Stethoscope size={24} />
            </div>

            <h4 className="text-base font-semibold text-gray-800">
              No doctors found
            </h4>

            <p className="text-sm text-gray-500 mt-1 mb-4">
              Add a doctor or change filters.
            </p>

            <button
              onClick={() => navigate("/admin/doctors/create")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Create Doctor
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-gray-50 text-left text-sm text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Doctor</th>
                  <th className="px-4 py-3 font-semibold">Specialization</th>
                  <th className="px-4 py-3 font-semibold">Experience</th>
                  <th className="px-4 py-3 font-semibold">Education</th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map((d) => (
                  <tr
                    key={d.userId}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-sm">
                          {d.firstName} {d.lastName}
                        </span>

                        <span className="text-xs text-gray-500">
                          {d.email || "No email"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                        {d.specialization || "N/A"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {d.yearsOfExperience ?? 0} yrs
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {d.education || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/doctors/${d.userId}`)
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-blue-600 border-blue-200 hover:bg-blue-50 text-xs transition"
                        >
                          <Eye size={14} />
                          View
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/admin/doctors/edit/${d.userId}`)
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-green-600 border-green-200 hover:bg-green-50 text-xs transition"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          onClick={() => openDeleteModal(d)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-red-600 border-red-200 hover:bg-red-50 text-xs transition"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={closeDeleteModal}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Doctor
            </h3>

            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800">
                {selectedDoctor?.firstName} {selectedDoctor?.lastName}
              </span>
              ?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={removeDoctor}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}