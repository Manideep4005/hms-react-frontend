import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/adminService";
import { Search, Trash2, Mail, Phone, BadgeCheck } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, users]);

  const load = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setFilteredUsers(data);
    setLoading(false);
  };

  const handleSearch = () => {
    const value = search.toLowerCase();
    const filtered = users.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const email = u.email?.toLowerCase();
      const mobile = u.mobileNumber?.toLowerCase();
      return (
        fullName.includes(value) ||
        email.includes(value) ||
        mobile.includes(value)
      );
    });
    setFilteredUsers(filtered);
  };

  const openDeleteModal = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    await deleteUser(selectedUser.id);
    closeModal();
    load();
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Users
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            Manage all registered users
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:w-[300px]">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* DESKTOP TABLE VIEW - hidden on mobile */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-[300px] text-gray-500">
            Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Mobile</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const role = u.roles?.map((r: any) => r.name).join(", ");
                    return (
                      <tr key={u.id} className="border-t hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                              {u.firstName?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">
                                {u.firstName} {u.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {u.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3">{u.mobileNumber}</td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                            {role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => openDeleteModal(u)}
                            className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-md transition text-sm"
                          >
                            Delete
                          </button>
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

      {/* MOBILE CARD VIEW - visible only on mobile/tablet */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-[300px] text-gray-500">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center text-gray-500">
            No users found
          </div>
        ) : (
          filteredUsers.map((u) => {
            const role = u.roles?.map((r: any) => r.name).join(", ");
            return (
              <div
                key={u.id}
                className="bg-white rounded-2xl border p-4 hover:shadow-md transition"
              >
                {/* Header with Avatar and Delete */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-base font-semibold">
                      {u.firstName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {u.firstName} {u.lastName}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        ID: {u.id}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openDeleteModal(u)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* User Details */}
                <div className="mt-3 space-y-2 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span className="text-gray-600 truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <span className="text-gray-600">{u.mobileNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BadgeCheck size={14} className="text-gray-400 shrink-0" />
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-medium">
                      {role}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DELETE MODAL - Made responsive */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[400px] p-4 sm:p-6 animate-fadeIn mx-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Delete User
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}