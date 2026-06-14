import { useEffect, useState } from "react";
import {
  getAdminProfile,
  updateAdminProfile,
} from "../../services/adminService";
import { User, Phone, Mail, Save, RefreshCw } from "lucide-react";

export default function Profile() {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getAdminProfile();
    setForm(data);
    setSaved(false);
  };

  const save = async () => {
    setLoading(true);
    await updateAdminProfile(form);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          Manage your personal information and account details
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white border rounded-xl sm:rounded-2xl shadow-sm">
        {/* SECTION TITLE */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">
            Personal Information
          </h2>
        </div>

        {/* FORM */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* First Name */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">
              First Name
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <User size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                className="w-full outline-none text-sm bg-transparent"
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
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">
              Last Name
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <User size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                className="w-full outline-none text-sm bg-transparent"
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
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">
              Mobile Number
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <Phone size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                className="w-full outline-none text-sm bg-transparent"
                value={form.mobileNumber || ""}
                onChange={(e) =>
                  setForm({ ...form, mobileNumber: e.target.value })
                }
                placeholder="Enter mobile number"
                type="tel"
                maxLength={10}
              />
            </div>
          </div>

          {/* Email - Disabled */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">
              Email Address
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <Mail size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                className="w-full outline-none text-sm bg-transparent text-gray-500 cursor-not-allowed"
                value={form.email || ""}
                disabled
              />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 bg-gray-50 rounded-b-xl sm:rounded-b-2xl">
          <button
            onClick={() => load()}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            Reset
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="px-5 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* SUCCESS TOAST MESSAGE */}
      {saved && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-up z-50">
          Profile updated successfully!
        </div>
      )}
    </div>
  );
}