import { useState } from "react";
import { changeDoctorPassword } from "../../services/doctorService";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);


  const navigate = useNavigate();

  const {
    user,
    logout
  } = useAuth();

  const forceChange =
    user?.forcePasswordChange ?? false;

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

    return "";
  };

  const submit = async (e: any) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await changeDoctorPassword({
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

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (e) {
      setError("Failed to update password");
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Change Password
          </h1>
          <p className="text-sm text-gray-500">
            Update your password to keep your account secure
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white border rounded-2xl shadow-sm">
          {/* SECTION */}
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-700">
              Security Settings
            </h2>
          </div>

          {/* FORM */}
          <form onSubmit={submit} className="p-6 space-y-5">
            {/* OLD PASSWORD */}
            {!forceChange && (
              < div >
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Current Password
                </label>
                <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                  <Lock size={16} className="text-gray-400 mr-2" />
                  <input
                    type={show ? "text" : "password"}
                    className="w-full outline-none text-sm"
                    value={form.oldPassword}
                    onChange={(e) =>
                      setForm({ ...form, oldPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                  />
                </div>
              </div>)}

            {/* NEW PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                New Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Lock size={16} className="text-gray-400 mr-2" />
                <input
                  type={show ? "text" : "password"}
                  className="w-full outline-none text-sm"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Use at least 6 characters. Combine letters & numbers.
              </p>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Confirm Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Lock size={16} className="text-gray-400 mr-2" />
                <input
                  type={show ? "text" : "password"}
                  className="w-full outline-none text-sm"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* ALERTS */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg border border-green-200">
                {success}
              </div>
            )}
          </form>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
            <button
              onClick={() =>
                setForm({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                })
              }
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100"
            >
              Reset
            </button>

            <button
              onClick={submit}
              disabled={loading}
              className="px-5 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div >
    </div >
  );
}

export default ChangePassword;
