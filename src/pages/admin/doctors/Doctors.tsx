import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  Stethoscope,
  Search,
  Filter,
  X,
  UserPlus,
  Calendar,
  GraduationCap,
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const resetFilters = () => {
    setSearch("");
    setSpecialization("");
    setShowMobileFilters(false);
  };

  if (loading) {
    return (
      <div className="h-[260px] flex items-center justify-center text-sm text-gray-500">
        Loading doctors...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Doctors</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage doctors and profiles
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/doctors/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
        >
          <UserPlus size={16} />
          Add Doctor
        </button>
      </div>

      {/* Filters - Desktop */}
      <div className="hidden md:block bg-white border rounded-xl shadow-sm p-3">
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
              className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
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
              className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 appearance-none bg-white"
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
            onClick={resetFilters}
            className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Mobile Filter Bar */}
      <div className="md:hidden flex gap-2">
        <div className="flex-1 relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="px-4 py-2 border rounded-lg flex items-center gap-2 text-sm"
        >
          <Filter size={15} />
          Filter
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {showMobileFilters && (
        <div className="md:hidden bg-white border rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800">Filters</h3>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={16} />
            </button>
          </div>

          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          >
            <option value="">All Specializations</option>
            {specializationOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            className="w-full border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Active Filters Display */}
      {(search || specialization) && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
              Search: {search}
              <button onClick={() => setSearch("")} className="hover:text-blue-900">
                <X size={12} />
              </button>
            </span>
          )}
          {specialization && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
              {specialization}
              <button onClick={() => setSpecialization("")} className="hover:text-blue-900">
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border rounded-xl shadow-sm overflow-hidden">
        {filteredDoctors.length === 0 ? (
          <EmptyState onNavigate={() => navigate("/admin/doctors/create")} />
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
                  <tr key={d.userId} className="border-t hover:bg-gray-50 transition">
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
                        <ActionButton
                          onClick={() => navigate(`/admin/doctors/${d.userId}`)}
                          icon={<Eye size={14} />}
                          label="View"
                          color="blue"
                        />
                        <ActionButton
                          onClick={() => navigate(`/admin/doctors/edit/${d.userId}`)}
                          icon={<Pencil size={14} />}
                          label="Edit"
                          color="green"
                        />
                        <ActionButton
                          onClick={() => openDeleteModal(d)}
                          icon={<Trash2 size={14} />}
                          label="Delete"
                          color="red"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredDoctors.length === 0 ? (
          <EmptyState onNavigate={() => navigate("/admin/doctors/create")} />
        ) : (
          filteredDoctors.map((d) => (
            <div
              key={d.userId}
              className="bg-white border rounded-xl p-4 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-base font-semibold">
                    {d.firstName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {d.firstName} {d.lastName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {d.email || "No email"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-3 space-y-2 pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Specialization:</span>
                  <span className="inline-flex px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                    {d.specialization || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Calendar size={12} /> Experience:
                  </span>
                  <span className="text-gray-700">{d.yearsOfExperience ?? 0} years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <GraduationCap size={12} /> Education:
                  </span>
                  <span className="text-gray-700 text-right">{d.education || "N/A"}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/doctors/${d.userId}`)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-blue-200 text-blue-600 text-sm hover:bg-blue-50 transition"
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => navigate(`/admin/doctors/edit/${d.userId}`)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-green-200 text-green-600 text-sm hover:bg-green-50 transition"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => openDeleteModal(d)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50 transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Modal - Responsive */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={closeDeleteModal}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-5 mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Doctor
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800">
                {selectedDoctor?.firstName} {selectedDoctor?.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={removeDoctor}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition"
              >
                Delete Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function EmptyState({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mb-3">
        <Stethoscope size={32} />
      </div>
      <h4 className="text-base font-semibold text-gray-800">
        No doctors found
      </h4>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Add a doctor or change filters.
      </p>
      <button
        onClick={onNavigate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
      >
        <UserPlus size={16} />
        Create Doctor
      </button>
    </div>
  );
}

function ActionButton({ onClick, icon, label, color }: any) {
  const colorClasses = {
    blue: "border-blue-200 text-blue-600 hover:bg-blue-50",
    green: "border-green-200 text-green-600 hover:bg-green-50",
    red: "border-red-200 text-red-600 hover:bg-red-50",
  } as any;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition ${colorClasses[color]}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}