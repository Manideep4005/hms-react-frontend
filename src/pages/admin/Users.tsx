import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/adminService";
import { Search } from "lucide-react";

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
    <div className="space-y-5">      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Users</h2>
          <p className="text-sm text-gray-500">Manage all registered users</p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-[300px]">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-[300px] text-gray-500">
            Loading users...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="text-left">Email</th>
                <th className="text-left">Mobile</th>
                <th className="text-left">Role</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-10 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const role = u.roles?.map((r: any) => r.name).join(", ");

                  return (
                    <tr
                      key={u.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      {/* USER */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                            {u.firstName?.charAt(0)}
                          </div>

                          {/* Name + ID */}
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

                      {/* EMAIL */}
                      <td className="text-gray-600">{u.email}</td>

                      {/* MOBILE */}
                      <td>{u.mobileNumber}</td>

                      {/* ROLE */}
                      <td>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                          {role}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="text-center">
                        <button
                          onClick={() => openDeleteModal(u)}
                          className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-md transition"
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
        )}
      </div>

      {/* DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          <div className="relative bg-white rounded-2xl shadow-xl w-[400px] p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-2">Delete User</h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
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
