import { useEffect, useState } from "react";
import { getPatientFullDetails } from "../../services/adminService";
import { useParams } from "react-router-dom";
import { Mail, Phone, Calendar, Activity, XCircle, DollarSign, ClipboardList, Receipt } from "lucide-react";

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

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-24 text-slate-400">
                <div className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
                <span className="text-sm">Loading patient details...</span>
            </div>
        );

    if (!data)
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-24 text-slate-400">
                <XCircle size={22} className="text-slate-300" />
                <span className="text-sm">No data found</span>
            </div>
        );

    const fullName = data.name;
    const initials = fullName?.[0];

    const completed = data.appointments.filter((a: any) => a.status === "COMPLETED").length;
    const cancelled = data.appointments.filter((a: any) => a.status === "CANCELLED").length;

    const revenue = data.bills
        .filter((b: any) => b.status === "PAID")
        .reduce((sum: number, b: any) => sum + b.totalAmount, 0);

    const badge = (status: string) => {
        if (status === "COMPLETED" || status === "PAID")
            return "bg-emerald-50 text-emerald-700 border border-emerald-200";
        if (status === "CANCELLED")
            return "bg-red-50 text-red-600 border border-red-200";
        return "bg-amber-50 text-amber-700 border border-amber-200";
    };

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* PROFILE HEADER - Responsive */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg sm:text-xl font-bold shrink-0 shadow-sm shadow-blue-600/20">
                            {initials}
                        </div>

                        <div className="min-w-0 flex-1">

                            <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                                {fullName}
                            </h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1.5">
                                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                                    <Mail size={12} className="shrink-0 text-slate-400" />
                                    <span className="truncate">{data.email}</span>
                                </p>
                                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                                    <Phone size={12} className="shrink-0 text-slate-400" />
                                    {data.mobile}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-500 shrink-0 bg-slate-50 rounded-lg px-3 py-1.5">
                        Patient ID: <span className="font-semibold text-slate-700">{patientId}</span>
                    </div>
                </div>
            </div>

            {/* KPI STRIP - Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white border border-slate-200 shadow-sm p-3.5 sm:p-4 rounded-xl sm:rounded-2xl">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Calendar size={13} className="text-blue-600" />
                        </span>
                        <p className="text-xs text-slate-500">Appointments</p>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-slate-900">{data.appointments.length}</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm p-3.5 sm:p-4 rounded-xl sm:rounded-2xl">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Activity size={13} className="text-emerald-600" />
                        </span>
                        <p className="text-xs text-slate-500">Completed</p>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-emerald-700">{completed}</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm p-3.5 sm:p-4 rounded-xl sm:rounded-2xl">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center">
                            <XCircle size={13} className="text-red-500" />
                        </span>
                        <p className="text-xs text-slate-500">Cancelled</p>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-red-600">{cancelled}</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm p-3.5 sm:p-4 rounded-xl sm:rounded-2xl">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <DollarSign size={13} className="text-indigo-600" />
                        </span>
                        <p className="text-xs text-slate-500">Revenue</p>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-slate-900">₹{revenue}</p>
                </div>
            </div>

            {/* TABS - Scrollable on mobile */}
            <div className="bg-slate-100/70 p-1 rounded-xl inline-flex gap-1 overflow-x-auto max-w-full">
                {["appointments", "bills"].map((t) => {
                    const isActive = tab === t;
                    const Icon = t === "appointments" ? ClipboardList : Receipt;
                    return (
                        <button
                            key={t}
                            onClick={() => setTab(t as any)}
                            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap rounded-lg transition ${isActive
                                ? "bg-white text-blue-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <Icon size={14} className={isActive ? "text-blue-600" : "text-slate-400"} />
                            {t === "appointments" ? "Appointments" : "Bills"}
                            <span
                                className={`px-1.5 py-0.5 rounded-full text-[11px] font-semibold ${isActive ? "bg-blue-50 text-blue-700" : "bg-slate-200/70 text-slate-500"
                                    }`}
                            >
                                {t === "appointments" ? data.appointments.length : data.bills.length}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* CONTENT */}
            <div className="space-y-3 sm:space-y-4">
                {/* APPOINTMENTS - Responsive Cards */}
                {tab === "appointments" && (
                    data.appointments.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-2">
                                <ClipboardList size={18} className="text-slate-300" />
                            </div>
                            <span className="text-sm text-slate-400">No appointments found</span>
                        </div>
                    ) : (
                        data.appointments.map((a: any) => (
                            <div
                                key={a.id}
                                className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 hover:shadow-md hover:border-slate-300 transition shadow-sm"
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-sm shadow-blue-600/20">
                                            {a.doctorName?.[0]}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between sm:hidden gap-2">
                                                <p className="font-semibold text-slate-900 truncate">{a.doctorName}</p>
                                                <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full shrink-0 ${badge(a.status)}`}>
                                                    {a.status}
                                                </span>
                                            </div>

                                            <p className="font-semibold text-slate-900 hidden sm:block">{a.doctorName}</p>
                                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                                {a.doctorSpecialization}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                                                <Calendar size={12} />
                                                {new Date(a.appointmentDate).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <span className={`hidden sm:inline-block px-3 py-1 text-xs font-medium rounded-full shrink-0 ${badge(a.status)}`}>
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
                        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-2">
                                <Receipt size={18} className="text-slate-300" />
                            </div>
                            <span className="text-sm text-slate-400">No bills found</span>
                        </div>
                    ) : (
                        data.bills.map((b: any) => (
                            <div
                                key={b.id}
                                className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3 hover:shadow-md hover:border-slate-300 transition shadow-sm"
                            >
                                {/* Bill Header */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-slate-900">
                                                Bill #{b.id}
                                            </p>
                                            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${badge(b.status)}`}>
                                                {b.status}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                            {b.doctorName} • {b.specialization}
                                        </p>
                                    </div>
                                    <p className="text-base sm:text-lg font-bold text-slate-900">
                                        ₹{b.totalAmount}
                                    </p>
                                </div>

                                {/* Bill Items */}
                                <div className="border-t border-slate-100 pt-3 space-y-2">
                                    {b.items.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between text-xs sm:text-sm">
                                            <span className="text-slate-600">
                                                {item.itemName} × {item.quantity}
                                            </span>
                                            <span className="text-slate-800 font-medium">
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