import { useEffect, useState } from "react";
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "../../services/doctorService";
import { User, Phone, Mail, Briefcase } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    education: "",
    specialization: "",
    yearsOfExperience: "",
    pastExperience: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getDoctorProfile();
    setProfile(res.data); // ✅ FIXED
  };

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    await updateDoctorProfile(profile);

    setLoading(false);
    alert("Profile updated successfully");
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Doctor Profile
          </h1>
          <p className="text-sm text-gray-500">
            Manage your professional and personal information
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          {/* SECTION TITLE */}
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
            <Input
              label="First Name"
              icon={<User size={16} />}
              value={profile.firstName}
              onChange={(val: string) =>
                setProfile({ ...profile, firstName: val })
              }
            />

            {/* Last Name */}
            <Input
              label="Last Name"
              icon={<User size={16} />}
              value={profile.lastName}
              onChange={(val: string) =>
                setProfile({ ...profile, lastName: val })
              }
            />

            {/* Mobile */}
            <Input
              label="Mobile Number"
              icon={<Phone size={16} />}
              value={profile.mobileNumber}
              onChange={(val: string) =>
                setProfile({ ...profile, mobileNumber: val })
              }
            />

            {/* Email */}
            <Input
              className="cursor-not-allowed "
              label="Email"
              icon={<Mail size={16} />}
              value={profile.email}
              disabled
            />

            {/* Education */}
            <Input
              label="Education"
              icon={<Briefcase size={16} />}
              value={profile.education}
              onChange={(val: string) =>
                setProfile({ ...profile, education: val })
              }
            />

            {/* Specialization */}
            <Input
              label="Specialization"
              icon={<Briefcase size={16} />}
              value={profile.specialization}
              onChange={(val: string) =>
                setProfile({ ...profile, specialization: val })
              }
            />

            {/* Experience */}
            <Input
              label="Years of Experience"
              icon={<Briefcase size={16} />}
              type="number"
              value={profile.yearsOfExperience}
              onChange={(val: string) =>
                setProfile({ ...profile, yearsOfExperience: val })
              }
            />

            {/* Past Experience */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Past Experience
              </label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={profile.pastExperience}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    pastExperience: e.target.value,
                  })
                }
                placeholder="Hospital / Organization details"
              />
            </div>

            {/* ACTIONS */}
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
    </div>
  );
}

export default Profile;

// 🔥 REUSABLE INPUT COMPONENT (SaaS pattern)
function Input({
  label,
  icon,
  value,
  onChange,
  disabled = false,
  type = "text",
}: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        {label}
      </label>

      <div
        className={`flex items-center border rounded-lg px-3 py-2 ${disabled
          ? "bg-gray-50"
          : "focus-within:ring-2 focus-within:ring-blue-500"
          }`}
      >
        <span className="text-gray-400 mr-2">{icon}</span>

        <input
          type={type}
          disabled={disabled}
          className="w-full outline-none text-sm bg-transparent"
          value={value || ""}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
