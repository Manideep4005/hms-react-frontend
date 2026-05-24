import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  User,
  Mail,
  Phone,
  GraduationCap,
  Stethoscope,
  Briefcase,
  Clock3,
  Loader2,
} from "lucide-react";
import { getDoctor } from "../../../services/adminService";

export default function ViewDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctor();
  }, []);

  const loadDoctor = async () => {
    try {
      setLoading(true);
      const data = await getDoctor(Number(id));
      setDoctor(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-5 py-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 flex items-center justify-center gap-3 text-gray-500 shadow-sm">
          <Loader2 className="animate-spin" size={18} />
          Loading doctor profile...
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-5 py-6">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Doctor Not Found
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            The requested doctor record does not exist.
          </p>

          <button
            onClick={() => navigate("/admin/doctors")}
            className="mt-5 px-5 h-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim();

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-5 py-6">
      {/* HEADER */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <button
            onClick={() => navigate("/admin/doctors")}
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition"
          >
            <ArrowLeft size={16} />
            Back to Doctors
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Doctor Profile
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View doctor information and professional details.
          </p>
        </div>

        <button
          onClick={() => navigate(`/admin/doctors/edit/${doctor.userId}`)}
          className="h-10 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-sm flex items-center justify-center gap-2"
        >
          <Pencil size={16} />
          Edit Doctor
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* TOP */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-semibold text-lg">
              {doctor.firstName?.charAt(0)}
              {doctor.lastName?.charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {fullName || "Doctor"}
              </h2>

              <p className="text-sm text-gray-500">
                {doctor.specialization || "General Specialist"}
              </p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            icon={<User size={16} />}
            label="First Name"
            value={doctor.firstName}
          />

          <Field
            icon={<User size={16} />}
            label="Last Name"
            value={doctor.lastName}
          />

          <Field
            icon={<Mail size={16} />}
            label="Email Address"
            value={doctor.email}
          />

          <Field
            icon={<Phone size={16} />}
            label="Mobile Number"
            value={doctor.mobileNumber}
          />

          <Field
            icon={<GraduationCap size={16} />}
            label="Education"
            value={doctor.education}
          />

          <Field
            icon={<Stethoscope size={16} />}
            label="Specialization"
            value={doctor.specialization}
          />

          <Field
            icon={<Clock3 size={16} />}
            label="Experience"
            value={
              doctor.yearsOfExperience
                ? `${doctor.yearsOfExperience} Years`
                : "N/A"
            }
          />

          <Field
            icon={<Briefcase size={16} />}
            label="Past Experience"
            value={doctor.pastExperience}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon: any;
}) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        {icon}
        {label}
      </div>

      <div className="text-sm font-semibold text-gray-900 break-words">
        {value || "N/A"}
      </div>
    </div>
  );
}