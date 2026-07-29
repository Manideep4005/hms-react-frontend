import { useEffect, useState } from "react";
import {
    ChevronDown,
    Search,
    DollarSign,
    CreditCard,
    Receipt,
    AlertCircle,
    Filter,
    Ban,
} from "lucide-react";
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

const FILTERS = ["ALL", "PAID", "UNPAID", "CANCELLED"];

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

    const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

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
        if (status === "PAID") return "bg-green-50 text-green-600";
        if (status === "UNPAID") return "bg-amber-50 text-amber-700";
        return "bg-red-50 text-red-600";
    };

    const kpis = [
        {
            key: "total",
            label: "Total Bills",
            value: total,
            display: total,
            icon: Receipt,
            accent: "text-blue-600 bg-blue-50",
        },
        {
            key: "paid",
            label: "Paid",
            value: paid,
            display: paid,
            icon: CreditCard,
            accent: "text-green-600 bg-green-50",
        },
        {
            key: "unpaid",
            label: "Unpaid",
            value: unpaid,
            display: unpaid,
            icon: AlertCircle,
            accent: "text-amber-600 bg-amber-50",
        },
        {
            key: "revenue",
            label: "Revenue",
            value: revenue,
            display: money(revenue),
            icon: DollarSign,
            accent: "text-blue-600 bg-blue-50",
        },
        {
            key: "pending",
            label: "Pending Amount",
            value: pendingAmount,
            display: money(pendingAmount),
            icon: DollarSign,
            accent: "text-red-500 bg-red-50",
        },
    ];

    return (
        <div className="space-y-5 sm:space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                    Billing
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Manage bills and payments
                </p>
            </div>

            {/* KPI STRIP */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                {kpis.map(({ key, label, display, icon: Icon, accent }) => (
                    <div
                        key={key}
                        className="bg-white ring-1 ring-gray-200 rounded-2xl p-4 transition-all hover:ring-blue-200 hover:shadow-[0_8px_24px_-12px_rgba(37,99,235,0.2)]"
                    >
                        <div className="flex items-center justify-between mb-2.5">
                            <p className="text-xs font-medium text-gray-500">{label}</p>
                            <div
                                className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${accent}`}
                            >
                                <Icon size={13} />
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-6 sm:h-7 w-16 rounded-md bg-gray-100 animate-pulse" />
                        ) : (
                            <p className="text-lg sm:text-xl font-semibold text-gray-900 tabular-nums truncate">
                                {display}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Desktop Filters */}
                <div className="hidden sm:flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                    {FILTERS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === t
                                    ? "bg-white shadow-sm text-gray-900"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t.charAt(0) + t.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Mobile Filter Dropdown */}
                <div className="sm:hidden relative">
                    <button
                        onClick={() => setShowMobileFilter(!showMobileFilter)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <Filter size={14} />
                            Filter: {filter.charAt(0) + filter.slice(1).toLowerCase()}
                        </div>
                        <ChevronDown
                            size={14}
                            className={`transition-transform ${showMobileFilter ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {showMobileFilter && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white ring-1 ring-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                            {FILTERS.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => {
                                        setFilter(t);
                                        setShowMobileFilter(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${filter === t
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {t.charAt(0) + t.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-[280px] md:w-[320px]">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        placeholder="Search by patient, doctor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-3 py-2.5 ring-1 ring-gray-200 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* LIST */}
            <div className="space-y-3">
                {loading &&
                    [...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white ring-1 ring-gray-200 rounded-2xl p-4 sm:p-5 space-y-3"
                        >
                            <div className="flex justify-between">
                                <div className="space-y-2">
                                    <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
                                    <div className="h-5 w-24 rounded bg-gray-100 animate-pulse" />
                                </div>
                                <div className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" />
                            </div>
                            <div className="h-3 w-40 rounded bg-gray-100 animate-pulse" />
                        </div>
                    ))}

                {!loading && filtered.length === 0 && (
                    <div className="flex flex-col items-center gap-2 text-center py-16 bg-white rounded-2xl ring-1 ring-gray-200">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                            <Receipt size={20} />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                            No bills found
                        </p>
                        <p className="text-xs text-gray-400">
                            Try a different filter or search term.
                        </p>
                    </div>
                )}

                {!loading &&
                    filtered.map((bill) => (
                        <div
                            key={bill.id}
                            className="bg-white ring-1 ring-gray-200 rounded-2xl p-4 sm:p-5 transition-all hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)]"
                        >
                            {/* TOP SECTION */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                {/* Left Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between sm:justify-start sm:gap-3">
                                        <p className="font-medium text-gray-500 text-sm">
                                            #{bill.id}
                                        </p>
                                        <span
                                            className={`sm:hidden px-2 py-0.5 text-xs font-medium rounded-full ${badge(
                                                bill.status
                                            )}`}
                                        >
                                            {bill.status === "CANCELLED" && (
                                                <Ban size={10} className="inline mr-1 -mt-0.5" />
                                            )}
                                            {bill.status}
                                        </span>
                                    </div>

                                    <p className="text-lg sm:text-xl font-semibold text-gray-900 mt-0.5 tabular-nums">
                                        {money(bill.totalAmount)}
                                    </p>

                                    <p className="text-sm font-medium text-gray-800 mt-2">
                                        {bill.patientName}
                                    </p>

                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Dr. {bill.doctorName} · {bill.specialization}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(bill.appointmentDate).toLocaleString()}
                                    </p>
                                </div>

                                {/* Right Actions */}
                                <div className="flex items-center justify-between sm:justify-end gap-2.5">
                                    <span
                                        className={`hidden sm:inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${badge(
                                            bill.status
                                        )}`}
                                    >
                                        {bill.status === "CANCELLED" && <Ban size={11} />}
                                        {bill.status}
                                    </span>

                                    {bill.status === "UNPAID" && (
                                        <button
                                            onClick={() => markAsPaid(bill.id)}
                                            disabled={payingId === bill.id}
                                            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            {payingId === bill.id ? (
                                                <div className="flex items-center justify-center gap-1.5">
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
                                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                                    >
                                        <ChevronDown
                                            size={18}
                                            className={`text-gray-400 transition-transform ${expanded[bill.id] ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* EXPANDED SECTION */}
                            {expanded[bill.id] && (
                                <div className="mt-4 border-t border-gray-100 pt-3.5 space-y-1.5">
                                    <p className="text-xs font-medium text-gray-500 mb-2">
                                        Bill Items
                                    </p>
                                    {bill.items.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between text-xs sm:text-sm py-1"
                                        >
                                            <span className="text-gray-600">
                                                {item.itemName} × {item.quantity}
                                            </span>
                                            <span className="font-medium text-gray-800 tabular-nums">
                                                {money(item.total)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between text-sm font-semibold text-gray-900">
                                        <span>Total</span>
                                        <span className="tabular-nums">
                                            {money(bill.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}