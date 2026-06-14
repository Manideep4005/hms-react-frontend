import { useEffect, useState } from "react";
import { ChevronDown, Search, DollarSign, CreditCard, Receipt, AlertCircle, Filter } from "lucide-react";
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
    const [showMobileFilter, setShowMobileFilter] = useState(false);

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

    const KpiCard = ({ label, value, color, icon }: any) => (
        <div className="bg-white border rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{label}</p>
                {icon}
            </div>
            <p className={`text-lg sm:text-xl font-semibold mt-1 ${color}`}>
                {label === "Revenue" || label === "Pending ₹" ? `₹${value}` : value}
            </p>
        </div>
    );

    return (
        <div className="space-y-4 sm:space-y-6 px-0">
            {/* HEADER */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Billing
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Manage bills and payments
                </p>
            </div>

            {/* KPI STRIP - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <KpiCard label="Total" value={total} color="text-gray-900" icon={<Receipt size={14} className="text-gray-400" />} />
                <KpiCard label="Paid" value={paid} color="text-green-600" icon={<CreditCard size={14} className="text-green-400" />} />
                <KpiCard label="Unpaid" value={unpaid} color="text-yellow-600" icon={<AlertCircle size={14} className="text-yellow-400" />} />
                <KpiCard label="Revenue" value={revenue} color="text-gray-900" icon={<DollarSign size={14} className="text-gray-400" />} />
                <KpiCard label="Pending ₹" value={pendingAmount} color="text-red-500" icon={<DollarSign size={14} className="text-red-400" />} />
            </div>

            {/* FILTER BAR - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Desktop Filters - Hidden on mobile */}
                <div className="hidden sm:flex gap-2 bg-gray-100 p-1 rounded-xl">
                    {["ALL", "PAID", "UNPAID", "CANCELLED"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-4 py-1.5 text-sm rounded-lg transition ${filter === t
                                    ? "bg-white shadow text-gray-900"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Mobile Filter Dropdown */}
                <div className="sm:hidden relative">
                    <button
                        onClick={() => setShowMobileFilter(!showMobileFilter)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <Filter size={14} />
                            Filter: {filter}
                        </div>
                        <ChevronDown size={14} className={`transition ${showMobileFilter ? "rotate-180" : ""}`} />
                    </button>

                    {showMobileFilter && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-10 overflow-hidden">
                            {["ALL", "PAID", "UNPAID", "CANCELLED"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => {
                                        setFilter(t);
                                        setShowMobileFilter(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition ${filter === t ? "bg-blue-50 text-blue-600" : "text-gray-700"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search - Full width on mobile */}
                <div className="relative w-full sm:w-[280px] md:w-[320px]">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        placeholder="Search by patient, doctor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-3 py-2 border rounded-xl text-sm w-full focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                </div>
            </div>

            {/* LIST - Responsive Cards */}
            <div className="space-y-3 sm:space-y-4">
                {loading && (
                    <div className="text-center py-10 text-gray-400">
                        Loading bills...
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-xl border">
                        No bills found
                    </div>
                )}

                {filtered.map((bill) => (
                    <div
                        key={bill.id}
                        className="bg-white border rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-md transition"
                    >
                        {/* TOP SECTION - Responsive */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            {/* Left Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between sm:justify-start sm:gap-3">
                                    <p className="font-medium text-gray-900 text-base sm:text-lg">
                                        #{bill.id}
                                    </p>
                                    <span className={`sm:hidden px-2 py-0.5 text-xs rounded-full ${badge(bill.status)}`}>
                                        {bill.status}
                                    </span>
                                </div>

                                <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                                    ₹{bill.totalAmount}
                                </p>

                                <p className="text-sm font-medium text-gray-700 mt-2">
                                    Patient: {bill.patientName}
                                </p>

                                <p className="text-xs sm:text-sm text-gray-500">
                                    Dr. {bill.doctorName} • {bill.specialization}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(bill.appointmentDate).toLocaleString()}
                                </p>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                <span className={`hidden sm:inline-block px-3 py-1 text-xs rounded-full ${badge(bill.status)}`}>
                                    {bill.status}
                                </span>

                                {bill.status === "UNPAID" && (
                                    <button
                                        onClick={() => markAsPaid(bill.id)}
                                        disabled={payingId === bill.id}
                                        className="flex-1 sm:flex-none bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition disabled:opacity-50"
                                    >
                                        {payingId === bill.id ? (
                                            <div className="flex items-center justify-center gap-1">
                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                        ) : (
                                            "Pay Now"
                                        )}
                                    </button>
                                )}

                                <button
                                    onClick={() => toggleExpand(bill.id)}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <ChevronDown
                                        size={18}
                                        className={`transition ${expanded[bill.id] ? "rotate-180" : ""}`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* EXPANDED SECTION - Bill Items */}
                        {expanded[bill.id] && (
                            <div className="mt-4 border-t pt-3 space-y-2">
                                <p className="text-xs font-medium text-gray-500 mb-2">Bill Items:</p>
                                {bill.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between text-xs sm:text-sm py-1"
                                    >
                                        <span className="text-gray-600">
                                            {item.itemName} × {item.quantity}
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            ₹{item.total}
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t pt-2 mt-2 flex justify-between text-sm font-semibold">
                                    <span>Total</span>
                                    <span>₹{bill.totalAmount}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}