import {Navigate} from "react-router-dom";
import {useAuth} from "./auth_provider";

export const ProtectedRoute = ({children}) => {
    const {user, setUser} = useAuth();
    console.log("+++++++++++++++++++++++++++" + user)
    if (user === null && localStorage.getItem("user_authenticated") === null) {
        // user is not authenticated
        console.log(localStorage.getItem("user_authenticated"))
        return <Navigate to="/login"/>;
    }
    setUser(localStorage.getItem("user_authenticated"));
    return children;
};
