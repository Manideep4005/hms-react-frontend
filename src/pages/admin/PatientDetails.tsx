import { useEffect, useState } from "react";
import { getPatientFullDetails } from "../../services/adminService";
import { useParams } from "react-router-dom";

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
        <div className="space-y-8">

            {/* 🔥 PROFILE HEADER */}
            <div className="bg-white border rounded-2xl p-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold">
                        {initials}
                    </div>

                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">{fullName}</h1>
                        <p className="text-sm text-gray-500">{data.email}</p>
                        <p className="text-sm text-gray-500">{data.mobile}</p>
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    Patient ID: <span className="font-medium">{patientId}</span>
                </div>
            </div>

            {/* 🔥 KPI STRIP (BETTER VISUAL) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500">Appointments</p>
                    <p className="text-xl font-semibold">{data.appointments.length}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="text-xl font-semibold text-green-700">{completed}</p>
                </div>

                <div className="bg-red-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500">Cancelled</p>
                    <p className="text-xl font-semibold text-red-600">{cancelled}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-xl font-semibold">₹{revenue}</p>
                </div>
            </div>

            {/* 🔥 TABS */}
            <div className="flex gap-2 border-b pb-2">
                {["appointments", "bills"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t as any)}
                        className={`px-4 py-2 text-sm font-medium ${tab === t
                            ? "border-b-2 border-gray-900 text-gray-900"
                            : "text-gray-500"
                            }`}
                    >
                        {t.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* 🔥 CONTENT */}
            <div className="space-y-4">

                {/* APPOINTMENTS (TIMELINE STYLE) */}
                {tab === "appointments" &&
                    data.appointments.map((a: any) => (
                        <div
                            key={a.id}
                            className="bg-white border rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition"
                        >
                            <div>
                                <p className="font-medium">{a.doctorName}</p>
                                <p className="text-sm text-gray-500">{a.doctorSpecialization}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(a.appointmentDate).toLocaleString()}
                                </p>
                            </div>

                            <span className={`px-3 py-1 text-xs rounded-full ${badge(a.status)}`}>
                                {a.status}
                            </span>
                        </div>
                    ))}

                {/* BILLS (STRUCTURED CARD) */}
                {tab === "bills" &&
                    data.bills.map((b: any) => (
                        <div
                            key={b.id}
                            className="bg-white border rounded-xl p-5 space-y-3"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium">
                                        #{b.id} • ₹{b.totalAmount}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {b.doctorName} • {b.specialization}
                                    </p>
                                </div>

                                <span className={`px-3 py-1 text-xs flex justify-center items-center rounded-full ${badge(b.status)}`}>
                                    {b.status}
                                </span>
                            </div>

                            <div className="border-t pt-3 space-y-2">
                                {b.items.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span>{item.itemName} × {item.quantity}</span>
                                        <span>₹{item.total}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}