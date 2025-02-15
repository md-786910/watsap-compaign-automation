import { Navigate, Outlet } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

const ProtectedRoute = () => {
    const [accessToken, _] = useLocalStorage("access_token");
    const [user, _1] = useLocalStorage("user");
    // Check if the user is authenticated
    if (!accessToken || !user) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
