import { useState } from "react";
import { registerUser } from "../../services/adminService";
import {
  Loader2,
  User,
  Mail,
  Phone,
  ClipboardList,
  Pill,
  KeyRound,
} from "lucide-react";

export default function RegisterUser() {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    role: "PATIENT",
  };

  const [form, setForm] = useState<any>(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required";
    if (!form.lastName.trim()) return "Last name is required";
    if (!form.email.includes("@")) return "Enter a valid email address";
    if (form.mobileNumber.length !== 10)
      return "Mobile number must be 10 digits";
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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-5 py-4 sm:py-6">
      {/* HEADER */}
      <div className="mb-4 sm:mb-6">
        {/* <p className="text-[11px] sm:text-xs font-semibold tracking-wide text-blue-600 uppercase mb-1">
          User management
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Create User
        </h1> */}
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
          Add a new system user with access role and credentials.
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {error && (
          <div className="mx-4 sm:mx-5 md:mx-6 mt-4 sm:mt-5 flex items-start gap-2.5 rounded-lg sm:rounded-xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-red-600">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        <div className="p-4 sm:p-5 md:p-6">
          {/* BASIC INFO */}
          <Section
            title="Basic Information"
            subtitle="Personal and contact details"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                required
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
                type="tel"
                icon={<Phone size={16} />}
                value={form.mobileNumber}
                onChange={(v: string) => updateField("mobileNumber", v)}
                placeholder="10 digit mobile number"
                maxLength={10}
                pattern="[0-9]{10}"
              />
            </div>
          </Section>

          {/* ACCESS DETAILS */}
          <Section title="Access Details" subtitle="Assign user role">
            <RoleSelect
              value={form.role}
              onChange={(v: string) => updateField("role", v)}
            />

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                <KeyRound size={15} className="text-blue-600" />
              </div>
              <p className="text-xs sm:text-sm text-blue-900/80 leading-relaxed">
                A temporary password will be generated automatically and
                sent to the user's email address. The user will be required
                to change their password during first login.
              </p>
            </div>
          </Section>

          {/* ACTION */}
          <div className="mt-5 sm:mt-6">
            <button
              onClick={submit}
              disabled={loading}
              className="w-full h-10 sm:h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-sm shadow-blue-600/20 transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm sm:text-base"
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
    <div className="mb-5 sm:mb-6 last:mb-0">
      <div className="mb-2.5 sm:mb-3.5 pb-2 sm:pb-3 border-b border-slate-100">
        <h2 className="text-sm sm:text-base font-semibold text-slate-900">
          {title}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
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
  maxLength,
  pattern,
}: any) {
  return (
    <div>
      <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          pattern={pattern}
          inputMode={type === "tel" ? "numeric" : "text"}
          className="w-full h-10 sm:h-11 pl-10 pr-3 rounded-lg sm:rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
        />
      </div>
    </div>
  );
}

/* ---------- ROLE SELECT ---------- */
/* Same behavior as the original SelectInput (calls onChange with the
   role's string value) — just presented as selectable cards instead
   of a native <select>. */
const ROLE_OPTIONS = [
  {
    label: "Patient",
    value: "PATIENT",
    description: "Books visits, views records",
    icon: User,
  },
  {
    label: "Receptionist",
    value: "RECEPTIONIST",
    description: "Front desk & scheduling",
    icon: ClipboardList,
  },
  {
    label: "Pharmacist",
    value: "PHARMACIST",
    description: "Dispensing & inventory",
    icon: Pill,
  },
];

function RoleSelect({ value, onChange }: any) {
  return (
    <div>
      <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
        Role
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ROLE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                "text-left rounded-xl border p-3.5 transition-all",
                isActive
                  ? "bg-blue-50 border-transparent ring-2 ring-blue-600"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
              ].join(" ")}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div
                  className={[
                    "h-8 w-8 rounded-lg flex items-center justify-center",
                    isActive ? "bg-white" : "bg-slate-100",
                  ].join(" ")}
                >
                  <Icon
                    size={16}
                    className={isActive ? "text-blue-600" : "text-slate-500"}
                  />
                </div>
                <span
                  className={[
                    "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                    isActive
                      ? "bg-blue-600 border-transparent"
                      : "border-slate-300",
                  ].join(" ")}
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
              </div>
              <p
                className={[
                  "text-sm font-semibold",
                  isActive ? "text-blue-700" : "text-slate-800",
                ].join(" ")}
              >
                {option.label}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}