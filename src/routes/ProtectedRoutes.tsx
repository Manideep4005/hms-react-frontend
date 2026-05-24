import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

type Props = {
  children: React.ReactNode
  role?: string
}

function ProtectedRoute({ children, role }: Props){

 const { user } = useAuth()

 if(!user){
  return <Navigate to="/" replace />
 }

 if(role && user.role !== role){
  return <Navigate to="/forbidden" replace />
 }

 return children
}

export default ProtectedRoute