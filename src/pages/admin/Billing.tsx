import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { getAllBills, payBill } from "../../services/adminService";
import { toast } from "react-toastify";

type BillItem = {
    itemName: string;
    quantity: number;
    price: number;
    total: number;
};

type Bill = {
    id: number;
    totalAmount: number;
    status: "PAID" | "UNPAID" | "CANCELLED";
    doctorName: string;
    patientName: string;
    specialization: string;
    appointmentDate: string;
    items: BillItem[];
};

export default function Billing() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});
    const [payingId, setPayingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const res = await getAllBills();
                setBills(Array.isArray(res) ? res : []);
            } catch {
                toast.error("Failed to load bills");
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, []);

    const toggleExpand = (id: number) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const markAsPaid = async (id: number) => {
        try {
            setPayingId(id);

            const res = await payBill(id);

            toast.success(res?.message || "Bill paid");

            setBills((prev) =>
                prev.map((b) =>
                    b.id === id
                        ? {
                            ...b,
                            status: "PAID",
                        }
                        : b
                )
            );
        } catch {
            toast.error("Payment failed");
        } finally {
            setPayingId(null);
        }
    };

    /* ================= KPI ================= */

    const total = bills.length;

    const paid = bills.filter((b) => b.status === "PAID").length;

    const unpaid = bills.filter((b) => b.status === "UNPAID").length;

    const revenue = bills
        .filter((b) => b.status === "PAID")
        .reduce((sum, b) => sum + b.totalAmount, 0);

    const pendingAmount = bills
        .filter((b) => b.status === "UNPAID")
        .reduce((sum, b) => sum + b.totalAmount, 0);

    /* ================= FILTER ================= */

    let filtered = bills;

    if (filter !== "ALL") {
        filtered = filtered.filter((b) => b.status === filter);
    }

    if (search) {
        const val = search.toLowerCase();

        filtered = filtered.filter(
            (b) =>
                b.doctorName?.toLowerCase().includes(val) ||
                b.patientName?.toLowerCase().includes(val) ||
                b.specialization?.toLowerCase().includes(val) ||
                b.id.toString().includes(val)
        );
    }

    const badge = (status: string) => {
        if (status === "PAID") {
            return "bg-green-50 text-green-600";
        }

        if (status === "UNPAID") {
            return "bg-yellow-50 text-yellow-700";
        }

        return "bg-red-50 text-red-600";
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Billing
                </h1>

                <p className="text-sm text-gray-500">
                    Manage bills and payments
                </p>
            </div>

            {/* KPI STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white border rounded-xl p-4">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-semibold">{total}</p>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-xs text-gray-500">Paid</p>
                    <p className="text-xl font-semibold text-green-600">
                        {paid}
                    </p>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-xs text-gray-500">Unpaid</p>
                    <p className="text-xl font-semibold text-yellow-600">
                        {unpaid}
                    </p>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-xl font-semibold">₹{revenue}</p>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-xs text-gray-500">Pending ₹</p>
                    <p className="text-xl font-semibold text-red-500">
                        ₹{pendingAmount}
                    </p>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                    {["ALL", "PAID", "UNPAID", "CANCELLED"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-4 py-1.5 text-sm rounded-lg ${filter === t
                                    ? "bg-white shadow text-gray-900"
                                    : "text-gray-500"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="relative w-[250px]">
                    <Search
                        size={16}
                        className="absolute left-3 top-2.5 text-gray-400"
                    />

                    <input
                        placeholder="Search by patient, doctor, bill id..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-3 py-2 border rounded-xl text-sm w-full focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                </div>
            </div>

            {/* LIST */}
            <div className="space-y-3">
                {loading && (
                    <div className="text-center py-10 text-gray-400">
                        Loading bills...
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No bills found
                    </div>
                )}

                {filtered.map((bill) => (
                    <div
                        key={bill.id}
                        className="bg-white border rounded-2xl p-5 hover:shadow-md transition"
                    >
                        {/* TOP */}
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900">
                                    #{bill.id} • ₹{bill.totalAmount}
                                </p>

                                <p className="text-sm font-medium text-gray-700 mt-1">
                                    Patient: {bill.patientName}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Dr. {bill.doctorName}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {bill.specialization}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(
                                        bill.appointmentDate
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span
                                    className={`px-3 py-1 text-xs rounded-full ${badge(
                                        bill.status
                                    )}`}
                                >
                                    {bill.status}
                                </span>

                                {bill.status === "UNPAID" && (
                                    <button
                                        onClick={() => markAsPaid(bill.id)}
                                        disabled={payingId === bill.id}
                                        className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800"
                                    >
                                        {payingId === bill.id
                                            ? "Processing..."
                                            : "Pay"}
                                    </button>
                                )}

                                <button
                                    onClick={() => toggleExpand(bill.id)}
                                >
                                    <ChevronDown
                                        size={18}
                                        className={`transition ${expanded[bill.id]
                                                ? "rotate-180"
                                                : ""
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* EXPANDED */}
                        {expanded[bill.id] && (
                            <div className="mt-4 border-t pt-3 space-y-2">
                                {bill.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>
                                            {item.itemName} × {item.quantity}
                                        </span>

                                        <span>₹{item.total}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}