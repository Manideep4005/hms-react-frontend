import { useState } from "react";
import { changeAdminPassword } from "../../services/adminService";
import { Lock, Eye, EyeOff, RefreshCw, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const {
    user,
    logout
  } = useAuth();

  const forceChange =
    user?.forcePasswordChange ?? false;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const validate = () => {

    if (
      !form.newPassword ||
      !form.confirmPassword
    ) {
      return "All fields are required";
    }

    if (
      !forceChange &&
      !form.oldPassword
    ) {
      return "Current password is required";
    }

    if (
      form.newPassword.length < 6
    ) {
      return "Password must be at least 6 characters";
    }

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      return "Passwords do not match";
    }

    if (
      !forceChange &&
      form.oldPassword ===
      form.newPassword
    ) {
      return "New password must be different from current password";
    }

    return "";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const resetForm = () => {
    setForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordStrength(0);
    setError("");
    setSuccess("");
  };

  const submit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await changeAdminPassword({
        oldPassword: forceChange
          ? null
          : form.oldPassword,
        newPassword: form.newPassword,
      });

      if (forceChange) {

        alert(
          "Password changed successfully. Please login again."
        );

        logout();

        navigate("/");

        return;
      }

      setSuccess(
        "Password updated successfully"
      );

      resetForm();
    } catch (e: any) {
      setError(
        e.response?.data?.message || "Failed to Update Password",
      );
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Change Password
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          Update your password to keep your account secure
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white border rounded-xl sm:rounded-2xl shadow-sm">
        {/* SECTION */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-gray-500" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">
              Security Settings
            </h2>
          </div>
        </div>

        {/* FORM */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* OLD PASSWORD */}
          {!forceChange && (
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">
                Current Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
                <Lock size={16} className="text-gray-400 mr-2 shrink-0" />
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="w-full outline-none text-sm bg-transparent"
                  value={form.oldPassword}
                  onChange={(e) =>
                    setForm({ ...form, oldPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded"
                >
                  {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>)}

          {/* NEW PASSWORD */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">
              New Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <Lock size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full outline-none text-sm bg-transparent"
                value={form.newPassword}
                onChange={(e) => {
                  setForm({ ...form, newPassword: e.target.value });
                  checkPasswordStrength(e.target.value);
                }}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {form.newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1.5">
                  <div className={`flex-1 rounded-full transition-all ${passwordStrength >= 1 ? getStrengthColor() : "bg-gray-200"}`} />
                  <div className={`flex-1 rounded-full transition-all ${passwordStrength >= 2 ? getStrengthColor() : "bg-gray-200"}`} />
                  <div className={`flex-1 rounded-full transition-all ${passwordStrength >= 3 ? getStrengthColor() : "bg-gray-200"}`} />
                  <div className={`flex-1 rounded-full transition-all ${passwordStrength >= 4 ? getStrengthColor() : "bg-gray-200"}`} />
                  <div className={`flex-1 rounded-full transition-all ${passwordStrength >= 5 ? getStrengthColor() : "bg-gray-200"}`} />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Password strength: <span className={`font-medium ${getStrengthColor().replace("bg-", "text-")}`}>
                      {getStrengthText()}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {form.newPassword.length}/6+ chars
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Use at least 6 characters with letters & numbers for a strong password.
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1 block">
              Confirm Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <Lock size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full outline-none text-sm bg-transparent"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Match indicator */}
            {form.confirmPassword && form.newPassword && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${form.newPassword === form.confirmPassword ? "text-green-600" : "text-red-500"}`}>
                {form.newPassword === form.confirmPassword ? (
                  <>
                    <CheckCircle size={12} /> Passwords match
                  </>
                ) : (
                  <>
                    <AlertCircle size={12} /> Passwords do not match
                  </>
                )}
              </p>
            )}
          </div>

          {/* ALERTS */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg border border-red-200 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg border border-green-200 flex items-start gap-2">
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 bg-gray-50 rounded-b-xl sm:rounded-b-2xl">
          <button
            onClick={resetForm}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            Reset
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Lock size={14} />
                Update Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}