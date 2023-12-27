import illustration from "./images/Illustration.png"
import success from "../login/images/success.png"
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {useAuth} from "../../hooks/auth_provider";

export const LoginPage = (props) => {
    const [login_status, setLogin] = useState(false)
    const navigate = useNavigate();
    const currentLocation = useLocation()
    const {user_login} = useAuth();
    const [error, setError] = useState("");

    async function register(email, password, confirmPassword) {
        const requestOptions = {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Request-Method": "POST",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: email, password: password}),
        }
        console.log("Enter Register Funciton")
        if (password === confirmPassword) {
            await fetch('http://127.0.0.1:5000/signup', requestOptions)
                .then(response => {
                    if (response.status === 401) {
                        throw new Error("Username or Password already exists")
                    }
                    if (!response.ok) {
                        throw new Error('Server returned ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    setLogin(true)
                    console.log("we got data");
                    console.log(data)
                    user_login(data);
                    // Do something with the data
                })
                .catch(error => {
                    setError(error.message)
                    console.error('There was a problem with the Fetch operation:', error);
                });
        } else {
            console.log("error")
            setError("Confirm Password doesn't match with Password")
        }


    }

    async function login(email, password) {
        const requestOptions = {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Request-Method": "POST",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: email, password: password}),
        }

        await fetch('http://127.0.0.1:5000/login', requestOptions)
            .then(response => {
                if (response.status === 401) {
                    throw new Error("Invalid username or password. Please try again.")
                }
                if (!response.ok) {
                    throw new Error('Server returned ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                setLogin(true)
                console.log("we got data");
                console.log(data)
                user_login(data);

                // Do something with the data
            })
            .catch(error => {
                setError("Invalid username or password. Please try again:")
                console.error('Invalid username or password. Please try again:', error);
            });
    }


    useEffect(() => {
        console.log(currentLocation)
        if (currentLocation.pathname === "/login") {
            console.log("Login")
        } else if (currentLocation.pathname === "/register") {
            console.log("Register")
        }

    }, [])
    return (<>
        <div className="login_page">
            <div className="max_width">
                <div className="col_image">
                    <img src={illustration} alt=""/>
                </div>
                <div className="col_content">
                    <div className="heading">
                        Welcome to <span><br/>Contextual Analysis Project</span>
                    </div>
                    <div className="google_login">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFFUTi1RsVDFSupmzDUJ5I3ZHBtwz043rbHQ&usqp=CAU"
                            alt=""/>
                        <span>Login with Google</span>
                    </div>
                    <div className="google_login">
                        <img
                            src="https://e1.pxfuel.com/desktop-wallpaper/217/687/desktop-wallpaper-twitter-logo-bird-logo-thumbnail.jpg"
                            alt=""/>
                        <span>Login with Twitter</span>
                    </div>
                    <div className="division">OR</div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (e.target[0].value && e.target[1].value) {

                            if (currentLocation.pathname === "/login") {
                                login(e.target[0].value, e.target[1].value)
                            } else if (currentLocation.pathname === "/register") {
                                register(e.target[0].value, e.target[1].value, e.target[2].value)

                            }
                            console.log(e.target[0].value)
                            console.log(e.target[1].value)
                            document.getElementById("login_email").value = "";
                            document.getElementById("login_password").value = "";

                        } else {
                            setError("Fields are Empty")
                        }
                    }}>
                        <div className="login_email">
                            <label htmlFor="login_email">Email</label>
                            <input type="email" name="username" id="login_email"/>

                        </div>
                        <br/>
                        <div className="login_password">
                            <label htmlFor="login_password">Password</label>
                            <input type="password" name="password" id="login_password"/>
                        </div>
                        {
                            currentLocation.pathname === '/register' ? <div className="login_password">
                                <label htmlFor="login_password">Confirm Password</label>
                                <input type="password" name="confirm_password" id="confirm_password"/>
                            </div> : ""
                        }
                        <div className="remember_me">
                            <div className="remember_checkbox">
                                <input type="checkbox" name="" id=""/>
                                <span>
                                    Remember me
                                </span>
                            </div>
                            <div className="remember_forget">
                                <span>
                                    Forget Password?
                                </span>
                            </div>
                        </div>
                        <button type={"submit"} className="login_button">
                            {currentLocation.pathname === "/login" ? "Login" : "Register"}
                        </button>
                    </form>
                </div>
                {
                    login_status ? <div className="login_popup">
                        <img src={success} alt=""/>
                        <div>Thanks You!!!</div>
                        <span>You have been successfully {currentLocation.pathname === "/login" ? "Login" : "Register"}</span>
                        <button onClick={() => {
                            setLogin(false)
                            navigate("/")
                        }}>Click to Continue
                        </button>
                    </div> : ""
                }
                {error !== "" ?
                    <div className="errorBox" onClick={() => setError("")}>
                        <div className="errorText">{error}
                        </div>
                    </div> : ""
                }
            </div>
        </div>
    </>)
}