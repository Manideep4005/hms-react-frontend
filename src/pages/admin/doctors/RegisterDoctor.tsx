import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDoctor } from "../../../services/adminService";
import {
  Loader2,
  User,
  Mail,
  Phone,
  GraduationCap,
  Stethoscope,
  Briefcase,
  Clock3,
  DollarSign,
} from "lucide-react";

export default function RegisterDoctor() {
  const navigate = useNavigate();

  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    education: "",
    specialization: "",
    yearsOfExperience: "",
    pastExperience: "",
    consultationFee: "",
  };

  const [form, setForm] = useState<any>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const submit = async () => {
    if (!form.firstName.trim()) {
      return setError("First name is required");
    }

    if (!form.email.trim()) {
      return setError("Email address is required");
    }

    try {
      setError("");
      setLoading(true);

      await createDoctor({
        ...form,
        yearsOfExperience: Number(form.yearsOfExperience || 0),
      });

      alert("Doctor created successfully");

      setForm(initialState);

      setTimeout(() => {
        navigate("/admin/doctors");
      }, 300);
    } catch {
      setError("Unable to create doctor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-5 py-5">
      {/* HEADER */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Register Doctor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add a new doctor profile with professional details.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* BASIC INFO */}
        <Section
          title="Basic Information"
          subtitle="Personal and contact details"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              icon={<User size={16} />}
              value={form.firstName}
              onChange={(v: string) => updateField("firstName", v)}
              placeholder="Enter first name"
            />

            <Input
              label="Last Name"
              icon={<User size={16} />}
              value={form.lastName}
              onChange={(v: string) => updateField("lastName", v)}
              placeholder="Enter last name"
            />

            <Input
              label="Email Address"
              required
              icon={<Mail size={16} />}
              value={form.email}
              onChange={(v: string) => updateField("email", v)}
              placeholder="doctor@email.com"
            />

            <Input
              label="Mobile Number"
              icon={<Phone size={16} />}
              value={form.mobileNumber}
              onChange={(v: string) => updateField("mobileNumber", v)}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </Section>

        {/* PROFESSIONAL INFO */}
        <Section
          title="Professional Details"
          subtitle="Qualification and experience"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Education"
              icon={<GraduationCap size={16} />}
              value={form.education}
              onChange={(v: string) => updateField("education", v)}
              placeholder="MBBS / MD / MS"
            />

            <Input
              label="Specialization"
              icon={<Stethoscope size={16} />}
              value={form.specialization}
              onChange={(v: string) => updateField("specialization", v)}
              placeholder="Cardiology"
            />

            <Input
              label="Years of Experience"
              icon={<Clock3 size={16} />}
              value={form.yearsOfExperience}
              onChange={(v: string) =>
                updateField("yearsOfExperience", v)
              }
              placeholder="5"
              type="number"
            />

            <Input
              label="Past Experience"
              icon={<Briefcase size={16} />}
              value={form.pastExperience}
              onChange={(v: string) => updateField("pastExperience", v)}
              placeholder="Apollo / Yashoda / Care"
            />
            <Input
              label="Consultation Fee"
              icon={<DollarSign size={16} />}
              value={form.consultationFee}
              onChange={(v: string) => updateField("consultationFee", v)}
              placeholder="500"
              type="number"
            />
          </div>
        </Section>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/admin/doctors")}
            className="w-full sm:w-auto px-5 h-10 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-10 rounded-xl font-medium shadow-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Doctor"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- SECTION ---------- */
function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: any;
}) {
  return (
    <div className="mb-6">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}

/* ---------- INPUT ---------- */
function Input({
  label,
  icon,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
        />
      </div>
    </div>
  );
}