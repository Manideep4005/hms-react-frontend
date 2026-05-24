import { useEffect, useState } from "react";
import { getMyBills, payBill } from "../../services/patientService"; // ✅ added payBill
import { Receipt, CreditCard, User, Calendar } from "lucide-react";
import { toast } from "react-toastify"; // ✅ import toast

/* ================= TYPES ================= */

interface BillItem {
    itemName: string;
    quantity: number;
    price: number;
    total: number;
}

interface Bill {
    id: number;
    totalAmount: number;
    status: "PAID" | "UNPAID";
    billDate: string;

    doctorName: string;
    specialization: string;
    appointmentDate: string;

    items: BillItem[];
}

/* ================= COMPONENT ================= */

export default function BillsPage() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await getMyBills();
            setBills(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error("Failed to fetch bills", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ UPDATED PAYMENT HANDLER
    const handlePay = async (billId: number) => {
        try {
            await payBill(billId);

            // ✅ Toast Success
            toast.success("Payment successful!");

            // ✅ Update UI instantly
            setBills((prev) =>
                prev.map((bill) =>
                    bill.id === billId
                        ? { ...bill, status: "PAID" }
                        : bill
                )
            );

        } catch (error) {
            console.error("Payment failed", error);

            // ❌ Error Toast
            toast.error("Payment failed. Try again.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    <h1 className="text-xl font-semibold">My Bills</h1>
                </div>
            </div>

            {/* States */}
            {loading ? (
                <p className="text-sm text-gray-400">Loading bills...</p>
            ) : bills.length === 0 ? (
                <p className="text-sm text-gray-400">No bills available</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    {bills.map((bill) => (
                        <div
                            key={bill.id}
                            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                        >

                            {/* TOP */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-sm font-semibold">
                                        Bill #{bill.id}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {bill.billDate}
                                    </p>
                                </div>

                                <span
                                    className={`px-2 py-1 text-xs rounded-full font-medium
                      ${bill.status === "PAID"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                        }`}
                                >
                                    {bill.status}
                                </span>
                            </div>

                            {/* DOCTOR */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Dr. {bill.doctorName}
                                </div>

                                <p className="text-xs text-gray-500 ml-6">
                                    {bill.specialization}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                    <Calendar className="w-4 h-4" />
                                    {bill.appointmentDate}
                                </div>
                            </div>

                            {/* ITEMS */}
                            <div className="space-y-1 text-sm mb-3">
                                {bill.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span className="text-gray-600">
                                            {item.itemName} × {item.quantity}
                                        </span>
                                        <span>₹{item.total}</span>
                                    </div>
                                ))}
                            </div>

                            {/* DIVIDER */}
                            <div className="border-t my-2" />

                            {/* BOTTOM */}
                            <div className="flex justify-between items-center mt-2">
                                <div>
                                    <p className="text-xs text-gray-500">Total</p>
                                    <p className="text-base font-semibold">
                                        ₹{bill.totalAmount}
                                    </p>
                                </div>

                                {bill.status === "UNPAID" ? (
                                    <button
                                        onClick={() => handlePay(bill.id)}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Pay
                                    </button>
                                ) : (
                                    <span className="text-xs text-green-600 font-medium">
                                        Paid
                                    </span>
                                )}
                            </div>

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}