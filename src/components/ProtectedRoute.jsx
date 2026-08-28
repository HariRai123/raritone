import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function ProtectedRoute({roles}){const{isAuthenticated,loading,user}=useAuth();const location=useLocation();if(loading)return <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3 bg-neutral-50"><Loader2 className="h-7 w-7 animate-spin"/><p className="text-sm text-neutral-500">Checking your session...</p></div>;if(!isAuthenticated)return <Navigate to="/login" replace state={{from:location.pathname}}/>;if(roles?.length&&!roles.includes(user?.role))return <Navigate to="/forbidden" replace/>;return <Outlet/>}
export default ProtectedRoute;
