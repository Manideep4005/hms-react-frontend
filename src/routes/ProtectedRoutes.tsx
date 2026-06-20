import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

type Props = {
  children: React.ReactNode
  role?: string
}

function ProtectedRoute({ children, role }: Props) {

  const { user } = useAuth()
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (user.forcePasswordChange) {

    const isChangePasswordPage =
      location.pathname.includes(
        "change-password"
      );

    if (!isChangePasswordPage) {

      if (user.role === "PATIENT") {
        return (
          <Navigate
            to="/patient/change-password"
            replace
          />
        );
      }

      if (user.role === "ADMIN") {
        return (
          <Navigate
            to="/admin/change-password"
            replace
          />
        );
      }

      if (user.role === "DOCTOR") {
        return (
          <Navigate
            to="/doctor/change-password"
            replace
          />
        );
      }
    }
  }

  if (role && user.role !== role) {
    return <Navigate to="/forbidden" replace />
  }

  return children
}

export default ProtectedRoute