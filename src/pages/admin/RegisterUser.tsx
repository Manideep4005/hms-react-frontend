import { useState } from "react";
import { registerUser } from "../../services/adminService";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
} from "lucide-react";

export default function RegisterUser() {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    role: "PATIENT",
  };

  const [form, setForm] = useState<any>(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required";
    if (!form.email.includes("@")) return "Enter a valid email address";
    if (form.mobileNumber.length !== 10)
      return "Mobile number must be 10 digits";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) return setError(err);

    try {
      setError("");
      setLoading(true);

      await registerUser(form.role, form);

      alert("User created successfully");

      setForm(initialState);
    } catch {
      setError("Unable to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-5 py-6">
      {/* HEADER */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Create User</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add a new system user with access role and credentials.
        </p>
      </div>

      {/* CARD */}
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
              type="email"
              icon={<Mail size={16} />}
              value={form.email}
              onChange={(v: string) => updateField("email", v)}
              placeholder="user@email.com"
            />

            <Input
              label="Mobile Number"
              required
              icon={<Phone size={16} />}
              value={form.mobileNumber}
              onChange={(v: string) => updateField("mobileNumber", v)}
              placeholder="10 digit mobile number"
            />
          </div>
        </Section>

        {/* ACCESS DETAILS */}
        <Section
          title="Access Details"
          subtitle="Login password and user role"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PASSWORD */}
            <PasswordInput
              label="Password"
              required
              value={form.password}
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              onChange={(v: string) => updateField("password", v)}
            />

            {/* ROLE */}
            <SelectInput
              label="Role"
              required
              icon={<Shield size={16} />}
              value={form.role}
              onChange={(v: string) => updateField("role", v)}
              options={[
                { label: "Patient", value: "PATIENT" },
                { label: "Receptionist", value: "RECEPTIONIST" },
              ]}
            />
          </div>
        </Section>

        {/* ACTION */}
        <div className="mt-6">
          <button
            onClick={submit}
            disabled={loading}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create User"
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

/* ---------- PASSWORD INPUT ---------- */
function PasswordInput({
  label,
  value,
  onChange,
  showPassword,
  onToggle,
  required,
}: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock size={16} />
        </div>

        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter password"
          className="w-full h-10 pl-10 pr-10 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ---------- SELECT ---------- */
function SelectInput({
  label,
  icon,
  value,
  onChange,
  required,
  options,
}: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          {icon}
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 pl-10 pr-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition appearance-none"
        >
          {options.map((item: any) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}