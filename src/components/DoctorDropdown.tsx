import { useState, useRef, useEffect } from "react";

type Props = {
  doctors: any[];
  value: string;
  onChange: (val: string) => void;
};

export default function DoctorDropdown({ doctors, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // close when click outside
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = doctors.filter((d) =>
    `${d.firstName} ${d.lastName} ${d.specialization}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const selected = doctors.find((d) => String(d.userId) === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* SELECT BOX */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full border rounded-lg p-2 cursor-pointer flex justify-between items-center"
      >
        <span>
          {selected
            ? `Dr. ${selected.firstName} ${selected.lastName}`
            : "Select Doctor"}
        </span>
        <span>▼</span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow">
          {/* SEARCH */}
          <input
            className="w-full p-2 border-b outline-none"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* LIST */}
          <div className="max-h-60 overflow-y-auto">
            {filtered.map((d) => (
              <div
                key={d.userId}
                onClick={() => {
                  onChange(String(d.userId));
                  setOpen(false);
                  setSearch("");
                }}
                className={`p-3 cursor-pointer ${
                  value === String(d.userId)
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <p className="font-medium">
                  Dr. {d.firstName} {d.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {d.specialization} • {d.yearsOfExperience} yrs exp
                </p>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="p-3 text-sm text-gray-400">No doctors found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
