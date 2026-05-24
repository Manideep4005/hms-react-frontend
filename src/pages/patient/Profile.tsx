import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/patientService";
import { User, Phone, Mail } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getProfile();
    setProfile(data);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    await updateProfile(profile);

    setLoading(false);
    alert("Profile updated");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
        <p className="text-sm text-gray-500">
          Manage your personal details and contact information
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white border rounded-2xl shadow-sm">
        {/* SECTION */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700">
            Personal Information
          </h2>
        </div>

        {/* FORM */}
        <form
          onSubmit={submit}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* First Name */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              First Name
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <User size={16} className="text-gray-400 mr-2" />
              <input
                className="w-full outline-none text-sm"
                value={profile.firstName || ""}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
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
                value={profile.lastName || ""}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
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
                value={profile.mobileNumber || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    mobileNumber: e.target.value,
                  })
                }
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Email Address
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <Mail size={16} className="text-gray-400 mr-2" />
              <input
                className="w-full outline-none text-sm bg-transparent text-gray-500 cursor-not-allowed"
                value={profile.email || ""}
                disabled
              />
            </div>
          </div>

          {/* FULL WIDTH BUTTON AREA */}
          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={load}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
