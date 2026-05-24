import { useEffect, useState } from "react";
import {
  getAdminProfile,
  updateAdminProfile,
} from "../../services/adminService";
import { User, Phone, Mail } from "lucide-react";

export default function Profile() {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getAdminProfile();
    setForm(data);
  };

  const save = async () => {
    setLoading(true);
    await updateAdminProfile(form);
    setLoading(false);
    alert("Profile Updated Successfully");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Profile Settings
        </h1>
        <p className="text-sm text-gray-500">
          Manage your personal information and account details
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white border rounded-2xl shadow-sm">
        {/* SECTION TITLE */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700">
            Personal Information
          </h2>
        </div>

        {/* FORM */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              First Name
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <User size={16} className="text-gray-400 mr-2" />
              <input
                className="w-full outline-none text-sm"
                value={form.firstName || ""}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                placeholder="Enter first name"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Last Name
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <User size={16} className="text-gray-400 mr-2" />
              <input
                className="w-full outline-none text-sm"
                value={form.lastName || ""}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Mobile Number
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Phone size={16} className="text-gray-400 mr-2" />
              <input
                className="w-full outline-none text-sm"
                value={form.mobileNumber || ""}
                onChange={(e) =>
                  setForm({ ...form, mobileNumber: e.target.value })
                }
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Email Address
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <Mail size={16} className="text-gray-400 mr-2" />
              <input
                className="w-full outline-none text-sm bg-transparent text-gray-500 cursor-not-allowed"
                value={form.email || ""}
                disabled
              />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => load()}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100"
          >
            Reset
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="px-5 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
