import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Loader2,
    Mail,
    ShieldCheck,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
} from "lucide-react";
import {
    forgotPassword,
    verifyOtp,
    resetPassword,
} from "../../services/authService";

type Step = "EMAIL" | "OTP" | "RESET" | "SUCCESS";

interface Errors {
    email?: string;
    otp?: string;
    password?: string;
    confirmPassword?: string;
}

function ForgotPassword() {
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>("EMAIL");

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState<Errors>({});
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(true);
    const [loading, setLoading] = useState(false);

    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const showAlert = (msg: string, success = true) => {
        setMessage(msg);
        setIsSuccess(success);
    };

    const validateEmail = () => {
        const newErrors: Errors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter valid email";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOtp = () => {
        const newErrors: Errors = {};

        if (!otp.trim()) {
            newErrors.otp = "OTP is required";
        } else if (otp.length !== 6) {
            newErrors.otp = "Enter valid 6 digit OTP";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors: Errors = {};

        if (!newPassword) {
            newErrors.password = "Password is required";
        } else if (newPassword.length < 6) {
            newErrors.password = "Minimum 6 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm password required";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail()) return;

        try {
            setLoading(true);
            const res = await forgotPassword(email);

            showAlert(res.message, res.success);

            if (res.success) {
                setStep("OTP");
            }
        } catch (error: any) {
            showAlert(
                error.response?.data?.message || "Failed to send OTP",
                false,
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateOtp()) return;

        try {
            setLoading(true);

            const res = await verifyOtp(
                email,
                otp,
            );

            showAlert(res.message, res.success);

            if (res.success) {
                setStep("RESET");
            }
        } catch (error: any) {
            showAlert(
                error.response?.data?.message || "OTP verification failed",
                false,
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePassword()) return;

        try {
            setLoading(true);

            const res = await resetPassword(
                email,
                newPassword,
            );

            showAlert(res.message, res.success);

            if (res.success) {
                setStep("SUCCESS");
            }
        } catch (error: any) {
            showAlert(
                error.response?.data?.message || "Password reset failed",
                false,
            );
        } finally {
            setLoading(false);
        }
    };

    const renderStepper = () => {
        const items = ["Email", "OTP", "Reset"];

        const active =
            step === "EMAIL"
                ? 1
                : step === "OTP"
                    ? 2
                    : step === "RESET" || step === "SUCCESS"
                        ? 3
                        : 1;

        return (
            <div className="flex items-center justify-center gap-3 mb-6">
                {items.map((item, index) => {
                    const current = index + 1;

                    return (
                        <div key={item} className="flex items-center gap-3">
                            <div
                                className={`w-8 h-8 rounded-full text-sm flex items-center justify-center font-semibold ${current <= active
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {current}
                            </div>

                            {index !== items.length - 1 && (
                                <div className="w-10 h-[2px] bg-gray-200" />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full -top-20 -left-20"></div>
            <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 blur-3xl rounded-full bottom-0 right-0"></div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <img
                        src="/MANI_HOSPITAL.png"
                        alt="Logo"
                        className="h-14 mx-auto mb-2 drop-shadow-md"
                    />
                    <p className="text-sm text-gray-500">
                        Recover access to your account
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-8">
                    {step !== "SUCCESS" && renderStepper()}

                    {message && (
                        <div
                            className={`px-3 py-2 rounded-md text-sm mb-4 ${isSuccess
                                ? "bg-green-50 border border-green-200 text-green-700"
                                : "bg-red-50 border border-red-200 text-red-700"
                                }`}
                        >
                            {message}
                        </div>
                    )}

                    {/* EMAIL */}
                    {step === "EMAIL" && (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="text-center">
                                <Mail className="mx-auto text-blue-600 mb-2" size={28} />
                                <h2 className="text-xl font-semibold">Forgot Password</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter your registered email
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    placeholder="you@example.com"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors((p) => ({ ...p, email: undefined }));
                                    }}
                                    className={`w-full mt-1 px-3 py-2.5 rounded-lg border ${errors.email
                                        ? "border-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                        } focus:outline-none focus:ring-2`}
                                />

                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium flex justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Sending...
                                    </>
                                ) : (
                                    "Send OTP"
                                )}
                            </button>
                        </form>
                    )}

                    {/* OTP */}
                    {step === "OTP" && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="text-center">
                                <ShieldCheck
                                    className="mx-auto text-blue-600 mb-2"
                                    size={28}
                                />
                                <h2 className="text-xl font-semibold">Verify OTP</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter OTP sent to {email}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    6 Digit OTP
                                </label>

                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    placeholder="123456"
                                    onChange={(e) => {
                                        setOtp(e.target.value.replace(/\D/g, ""));
                                        setErrors((p) => ({ ...p, otp: undefined }));
                                    }}
                                    className={`w-full mt-1 px-3 py-2.5 rounded-lg border tracking-[0.35em] text-center text-lg ${errors.otp
                                        ? "border-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                        } focus:outline-none focus:ring-2`}
                                />

                                {errors.otp && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.otp}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium flex justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify OTP"
                                )}
                            </button>
                        </form>
                    )}

                    {/* RESET */}
                    {step === "RESET" && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="text-center">
                                <Lock className="mx-auto text-blue-600 mb-2" size={28} />
                                <h2 className="text-xl font-semibold">Reset Password</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter your new password
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    New Password
                                </label>

                                <div className="relative mt-1">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setErrors((p) => ({
                                                ...p,
                                                password: undefined,
                                            }));
                                        }}
                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-3 text-gray-400"
                                    >
                                        {showPass ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Confirm Password
                                </label>

                                <div className="relative mt-1">
                                    <input
                                        type={showConfirmPass ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setErrors((p) => ({
                                                ...p,
                                                confirmPassword: undefined,
                                            }));
                                        }}
                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPass(!showConfirmPass)
                                        }
                                        className="absolute right-3 top-3 text-gray-400"
                                    >
                                        {showConfirmPass ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium flex justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Updating...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    )}

                    {/* SUCCESS */}
                    {step === "SUCCESS" && (
                        <div className="text-center space-y-5">
                            <CheckCircle2
                                className="mx-auto text-green-600"
                                size={56}
                            />

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Password Reset Successful
                                </h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    Your password has been updated successfully.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate("/")}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}

                    <p className="text-sm text-center text-gray-600 mt-6">
                        Remembered password?
                        <Link
                            to="/"
                            className="text-blue-600 ml-1 font-medium hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;