import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/adminService";
import {
  Search,
  Trash2,
  Mail,
  Phone,
  BadgeCheck,
  Users as UsersIcon,
  X,
  Stethoscope,
} from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, users]);

  const load = async () => {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const value = search.toLowerCase().trim();

    const filtered = users.filter((u) => {
      const fullName =
        `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();

      const email = (u.email ?? "").toLowerCase();
      const mobile = (u.mobileNumber ?? "").toLowerCase();

      return (
        fullName.includes(value) ||
        email.includes(value) ||
        mobile.includes(value)
      );
    });

    setFilteredUsers(filtered);
  };

  /**
   * Returns all roles assigned to the user.
   */
  const getUserRoles = (user: any): string[] => {
    return (
      user.roles
        ?.map((role: any) => role.name?.toUpperCase())
        .filter(Boolean) ?? []
    );
  };

  /**
   * Doctors are managed from the Doctors module.
   * They must not be deleted through the generic Users API.
   */
  const isDoctor = (user: any): boolean => {
    return getUserRoles(user).includes("DOCTOR");
  };

  const getRoleLabel = (user: any): string => {
    const roles = getUserRoles(user);

    return roles.length > 0 ? roles.join(", ") : "USER";
  };

  const openDeleteModal = (user: any) => {
    // Extra safety check.
    // Even if this function is accidentally called for a doctor,
    // never allow the generic delete API to be triggered.
    if (isDoctor(user)) {
      return;
    }

    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    if (deleting) return;

    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    // Extra protection against accidentally deleting a doctor.
    if (isDoctor(selectedUser)) {
      closeModal();
      return;
    }

    try {
      setDeleting(true);

      await deleteUser(selectedUser.id);

      closeModal();
      await load();
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeleting(false);
    }
  };

  const initialsColor = (seed: string) => {
    const shades = [
      "bg-blue-50 text-blue-600",
      "bg-sky-50 text-sky-600",
      "bg-indigo-50 text-indigo-600",
    ];

    const idx = (seed?.charCodeAt(0) || 0) % shades.length;

    return shades[idx];
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
            Users
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            Manage all registered users
            {!loading && (
              <span className="text-gray-400">
                {" "}
                · {filteredUsers.length} of {users.length}
              </span>
            )}
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:w-[300px]">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by name, email, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl ring-1 ring-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm placeholder:text-gray-400 transition-shadow"
          />
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse shrink-0" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/4 rounded bg-gray-100 animate-pulse" />
                  <div className="h-2.5 w-1/6 rounded bg-gray-100 animate-pulse" />
                </div>

                <div className="h-3 w-32 rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                <div className="h-6 w-20 rounded-md bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    User
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Email
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Mobile
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Role
                  </th>

                  <th className="px-4 py-3 text-center font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                          <UsersIcon size={20} />
                        </div>

                        <p className="text-sm font-medium text-gray-700">
                          No users found
                        </p>

                        <p className="text-xs text-gray-400">
                          Try a different name, email, or number.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const doctor = isDoctor(u);
                    const role = getRoleLabel(u);

                    return (
                      <tr
                        key={u.id}
                        className="border-t border-gray-100 hover:bg-gray-50/70 transition-colors"
                      >
                        {/* USER */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${initialsColor(
                                u.firstName
                              )}`}
                            >
                              {u.firstName?.charAt(0)}
                            </div>

                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {u.firstName} {u.lastName}
                              </div>

                              <div className="text-xs text-gray-400">
                                ID: {u.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-4 py-3 text-gray-600">
                          {u.email}
                        </td>

                        {/* MOBILE */}
                        <td className="px-4 py-3 text-gray-600">
                          {u.mobileNumber}
                        </td>

                        {/* ROLE */}
                        <td className="px-4 py-3">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                            {role}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-3 text-center">
                          {doctor ? (
                            <div
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 text-sm font-medium"
                              title="Doctors are managed from the Doctors module"
                            >
                              <Stethoscope size={14} />
                              Managed in Doctors
                            </div>
                          ) : (
                            <button
                              onClick={() => openDeleteModal(u)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl ring-1 ring-gray-200 p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse shrink-0" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/5 rounded bg-gray-100 animate-pulse" />
                  <div className="h-2.5 w-1/4 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
            </div>
          ))
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-10 flex flex-col items-center gap-2 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
              <UsersIcon size={20} />
            </div>

            <p className="text-sm font-medium text-gray-700">
              No users found
            </p>

            <p className="text-xs text-gray-400">
              Try a different name, email, or number.
            </p>
          </div>
        ) : (
          filteredUsers.map((u) => {
            const doctor = isDoctor(u);
            const role = getRoleLabel(u);

            return (
              <div
                key={u.id}
                className="bg-white rounded-2xl ring-1 ring-gray-200 p-4 transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)]"
              >
                {/* HEADER */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold shrink-0 ${initialsColor(
                        u.firstName
                      )}`}
                    >
                      {u.firstName?.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {u.firstName} {u.lastName}
                      </div>

                      <div className="text-xs text-gray-400 mt-0.5">
                        ID: {u.id}
                      </div>
                    </div>
                  </div>

                  {/* MOBILE ACTION */}
                  {doctor ? (
                    <div
                      className="p-2 text-gray-400 bg-gray-50 rounded-lg"
                      title="Managed in Doctors"
                    >
                      <Stethoscope size={18} />
                    </div>
                  ) : (
                    <button
                      onClick={() => openDeleteModal(u)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {/* USER DETAILS */}
                <div className="mt-3 space-y-2 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail
                      size={14}
                      className="text-gray-400 shrink-0"
                    />

                    <span className="text-gray-600 truncate">
                      {u.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Phone
                      size={14}
                      className="text-gray-400 shrink-0"
                    />

                    <span className="text-gray-600">
                      {u.mobileNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <BadgeCheck
                      size={14}
                      className="text-gray-400 shrink-0"
                    />

                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-medium">
                      {role}
                    </span>
                  </div>

                  {/* DOCTOR MANAGEMENT NOTE */}
                  {doctor && (
                    <div className="flex items-center gap-2 pt-2 text-xs text-gray-400">
                      <Stethoscope size={13} />
                      <span>Manage this doctor from Doctors</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DELETE MODAL */}
      {showModal && selectedUser && !isDoctor(selectedUser) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative bg-white rounded-2xl shadow-xl ring-1 ring-gray-900/5 w-full max-w-[400px] p-5 sm:p-6 animate-fadeIn">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Trash2 size={18} />
              </div>

              <button
                onClick={closeModal}
                disabled={deleting}
                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Delete user
            </h3>

            <p className="text-sm text-gray-500 mt-1.5 mb-6 leading-relaxed">
              <span className="font-medium text-gray-800">
                {selectedUser.firstName} {selectedUser.lastName}
              </span>{" "}
              will lose access immediately. This can't be undone.
            </p>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={closeModal}
                disabled={deleting}
                className="px-4 py-2 rounded-xl ring-1 ring-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {deleting ? "Deleting..." : "Delete user"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}