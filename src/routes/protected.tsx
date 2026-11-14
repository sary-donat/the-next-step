import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/auth"
import type { User } from "../types/types"
interface ProtectedProps
{
     allowedRoles?: User['role'][];
}
const Protected = ({allowedRoles}:ProtectedProps) => {

   const  { user,isLaoding }=useAuth()
   if(isLaoding)
        return <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-muted">טוען...</p>
    if (!user)
        return <Navigate to="/login" replace />
        if(allowedRoles&&!allowedRoles.includes(user.role))
            return <Navigate to="/home"></Navigate>
    return <Outlet/>
}
export default Protected;