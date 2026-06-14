import { useEffect, useState } from "react";
import { getPatientFullDetails } from "../../services/adminService";
import { useParams } from "react-router-dom";
import { Mail, Phone, Calendar, Activity, XCircle, DollarSign } from "lucide-react";

export default function PatientDetails() {
    const { patientId } = useParams();
    const [data, setData] = useState<any>(null);
    const [tab, setTab] = useState<"appointments" | "bills">("appointments");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await getPatientFullDetails(Number(patientId));
            setData(res);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!data) return <div className="p-10 text-center">No data</div>;

    const fullName = data.name;
    const initials = fullName?.[0];

    const completed = data.appointments.filter((a: any) => a.status === "COMPLETED").length;
    const cancelled = data.appointments.filter((a: any) => a.status === "CANCELLED").length;

    const revenue = data.bills
        .filter((b: any) => b.status === "PAID")
        .reduce((sum: number, b: any) => sum + b.totalAmount, 0);

    const badge = (status: string) => {
        if (status === "COMPLETED" || status === "PAID")
            return "bg-green-100 text-green-700";
        if (status === "CANCELLED")
            return "bg-red-100 text-red-600";
        return "bg-yellow-100 text-yellow-700";
    };

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* PROFILE HEADER - Responsive */}
            <div className="bg-white border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg sm:text-xl font-bold shrink-0">
                            {initials}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                                {fullName}
                            </h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                    <Mail size={12} className="shrink-0" />
                                    <span className="truncate">{data.email}</span>
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                    <Phone size={12} className="shrink-0" />
                                    {data.mobile}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-500 shrink-0">
                        Patient ID: <span className="font-medium">{patientId}</span>
                    </div>
                </div>
            </div>

            {/* KPI STRIP - Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} /> Appointments
                    </p>
                    <p className="text-lg sm:text-xl font-semibold">{data.appointments.length}</p>
                </div>

                <div className="bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Activity size={12} /> Completed
                    </p>
                    <p className="text-lg sm:text-xl font-semibold text-green-700">{completed}</p>
                </div>

                <div className="bg-red-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <XCircle size={12} /> Cancelled
                    </p>
                    <p className="text-lg sm:text-xl font-semibold text-red-600">{cancelled}</p>
                </div>

                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <DollarSign size={12} /> Revenue
                    </p>
                    <p className="text-lg sm:text-xl font-semibold">₹{revenue}</p>
                </div>
            </div>

            {/* TABS - Scrollable on mobile */}
            <div className="border-b overflow-x-auto">
                <div className="flex gap-2 min-w-max sm:min-w-0">
                    {["appointments", "bills"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t as any)}
                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${tab === t
                                ? "border-b-2 border-gray-900 text-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t === "appointments" ? "APPOINTMENTS" : "BILLS"}
                            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-100 text-xs">
                                {t === "appointments" ? data.appointments.length : data.bills.length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT */}
            <div className="space-y-3 sm:space-y-4">
                {/* APPOINTMENTS - Responsive Cards */}
                {tab === "appointments" && (
                    data.appointments.length === 0 ? (
                        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                            No appointments found
                        </div>
                    ) : (
                        data.appointments.map((a: any) => (
                            <div
                                key={a.id}
                                className="bg-white border rounded-lg sm:rounded-xl p-4 hover:shadow-sm transition"
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between sm:hidden">
                                            <p className="font-medium text-gray-900">{a.doctorName}</p>
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${badge(a.status)}`}>
                                                {a.status}
                                            </span>
                                        </div>

                                        <p className="font-medium text-gray-900 hidden sm:block">{a.doctorName}</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                            {a.doctorSpecialization}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(a.appointmentDate).toLocaleString()}
                                        </p>
                                    </div>

                                    <span className={`hidden sm:inline-block px-3 py-1 text-xs rounded-full ${badge(a.status)}`}>
                                        {a.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )
                )}

                {/* BILLS - Responsive Cards */}
                {tab === "bills" && (
                    data.bills.length === 0 ? (
                        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                            No bills found
                        </div>
                    ) : (
                        data.bills.map((b: any) => (
                            <div
                                key={b.id}
                                className="bg-white border rounded-lg sm:rounded-xl p-4 sm:p-5 space-y-3 hover:shadow-sm transition"
                            >
                                {/* Bill Header */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-gray-900">
                                                Bill #{b.id}
                                            </p>
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${badge(b.status)}`}>
                                                {b.status}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                            {b.doctorName} • {b.specialization}
                                        </p>
                                    </div>
                                    <p className="text-base sm:text-lg font-bold text-gray-900">
                                        ₹{b.totalAmount}
                                    </p>
                                </div>

                                {/* Bill Items */}
                                <div className="border-t pt-3 space-y-2">
                                    {b.items.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between text-xs sm:text-sm">
                                            <span className="text-gray-600">
                                                {item.itemName} × {item.quantity}
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                ₹{item.total}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
}