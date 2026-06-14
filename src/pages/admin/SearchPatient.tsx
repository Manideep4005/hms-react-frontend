import { useState } from "react";
import {
  searchPatientById,
  searchPatientByMobile,
} from "../../services/adminService";
import { Search, ArrowRight, User, Mail, Phone, Hash, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchPatient() {
  const [type, setType] = useState<"id" | "mobile">("id");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const search = async () => {
    if (!value) {
      setError("Please enter a value");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let res;

      if (type === "id") {
        if (isNaN(Number(value))) {
          setError("Please enter a valid numeric ID");
          setLoading(false);
          return;
        }
        res = await searchPatientById(Number(value));
      } else {
        if (!/^\d{10}$/.test(value)) {
          setError("Please enter a valid 10-digit mobile number");
          setLoading(false);
          return;
        }
        res = await searchPatientByMobile(value);
      }

      if (!res) {
        setError("No patient found");
      } else {
        setResult(res);
      }
    } catch {
      setError("No patient found");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6 md:space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          Search Patient
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          Quickly find patients using ID or mobile number
        </p>
      </div>

      {/* SEARCH CARD */}
      <div className="bg-white border rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        {/* TOGGLE - Made responsive */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-fit">
          {["id", "mobile"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t as any);
                setValue("");
                setResult(null);
                setError("");
              }}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-lg transition ${type === t
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500"
                }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                {t === "id" ? <Hash size={14} /> : <Smartphone size={14} />}
                {t === "id" ? "By ID" : "By Mobile"}
              </div>
            </button>
          ))}
        </div>

        {/* FORM - Responsive layout */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              autoFocus
              type={type === "id" ? "number" : "tel"}
              placeholder={
                type === "id"
                  ? "Enter Patient ID"
                  : "Enter 10-digit Mobile Number"
              }
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-gray-900 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            ) : (
              "Search"
            )}
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-xs sm:text-sm bg-red-50 px-3 py-2 rounded-lg">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* RESULT CARD - Responsive */}
      {result && (
        <div className="bg-white border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            {/* LEFT - Patient Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
                {result.firstName?.[0]}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-base sm:text-lg">
                  {result.firstName} {result.lastName}
                </p>

                <div className="space-y-0.5 sm:space-y-1 mt-1">
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                    <Mail size={12} className="shrink-0" />
                    <span className="truncate">{result.email || "No email"}</span>
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                    <Phone size={12} className="shrink-0" />
                    {result.mobileNumber}
                  </p>

                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Hash size={10} />
                    ID: {result.id}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT ACTION - Full width on mobile */}
            <button
              onClick={() => {
                if (!result?.id) return;
                navigate(`/admin/patient/${result.id}/details`);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-blue-50 sm:bg-transparent text-blue-600 rounded-lg sm:rounded-none hover:bg-blue-100 sm:hover:underline transition"
            >
              View Profile <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !result && !error && (
        <div className="text-center py-12 sm:py-16 text-gray-400 text-xs sm:text-sm bg-white rounded-xl border">
          <Search size={32} className="mx-auto mb-3 text-gray-300" />
          Search for a patient to view details
        </div>
      )}
    </div>
  );
}

// Add this helper component if AlertCircle is not imported
const AlertCircle = ({ size, className }: { size: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);