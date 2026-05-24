import { useState } from "react";
import {
  searchPatientById,
  searchPatientByMobile,
} from "../../services/adminService";
import { Search, ArrowRight } from "lucide-react";
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
      setError("Please enter value");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let res;

      if (type === "id") {
        res = await searchPatientById(Number(value));
      } else {
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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Search Patient
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quickly find patients using ID or mobile number
        </p>
      </div>

      {/* SEARCH CARD */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
        {/* TOGGLE */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          {["id", "mobile"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t as any);
                setValue("");
                setResult(null);
                setError("");
              }}
              className={`px-4 py-1.5 text-sm rounded-lg transition ${type === t
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500"
                }`}
            >
              {t === "id" ? "By ID" : "By Mobile"}
            </button>
          ))}
        </div>

        {/* FORM (ENTER KEY SUPPORT) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />

            <input
              autoFocus
              placeholder={
                type === "id"
                  ? "Enter Patient ID"
                  : "Enter Mobile Number"
              }
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-gray-900 outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-800 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition flex justify-between items-center">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
              {result.firstName?.[0]}
            </div>

            <div>
              <p className="font-medium text-gray-900">
                {result.firstName} {result.lastName}
              </p>

              <p className="text-sm text-gray-500">
                {result.email || "No email"}
              </p>

              <p className="text-sm text-gray-500">
                {result.mobileNumber}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                ID: {result.id}
              </p>
            </div>
          </div>

          {/* RIGHT ACTION */}
          <button
            onClick={() => {
              if (!result?.id) return;
              navigate(`/admin/patient/${result.id}/details`);
            }}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            View Profile <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !result && !error && (
        <div className="text-center py-16 text-gray-400 text-sm">
          Search for a patient to view details
        </div>
      )}
    </div>
  );
}