import {useNavigate} from "react-router-dom";
import {useMemo, useState, createContext, useContext} from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const user_login = async (data) => {
        console.log("login function is called")
        localStorage.setItem("user_authenticated", "authenticated");
        console.log(data)
        setUser(data);
        navigate("/");
    };

    // call this function to sign out logged in user
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user_authenticated");
        navigate("/login", {replace: true});
    };

    const value = useMemo(
        () => ({
            user,
            setUser,
            user_login,
            logout
        }),
        [user]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
