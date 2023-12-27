import logo from "./assets/images/logo/logo.png"
import './App.css';
import {Route, Routes} from "react-router-dom";
import {HomePage} from "./components/HomePage";
import {TopicDetails} from "./components/TopicDetails";
import {register} from 'swiper/element/bundle';
import {useEffect, useState} from "react";
import {LoginPage} from "./components/login/LoginPage";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {useAuth} from "./hooks/auth_provider";
import {ProtectedRoute} from "./hooks/protected_route";
import {DataContext} from "./components/data_hook";
import {ProgressBar} from "./components/ProgressBar";
import {HistoryPage} from "./components/HistoryPage";
import {useLocation} from "react-router";

function App() {
    const {user, logout} = useAuth();
    const [state, setState] = useState({});
    const currentLocation = useLocation()

    useEffect(() => {
        register();
        AOS.init();
        console.log(user)
    }, [])

    return (
        <div className="App">
            <DataContext.Provider value={[state, setState]}>

                <div className="navbar">
                    <div className="max_width">
                        <div className="logo">
                            <img src={logo} alt=""/>
                            <a href={"/"} className={"logo_text"}>Contextual Analysis Project!</a>
                        </div>
                        {
                            user !== "authenticated" ? <div>
                                    <div className="login">
                                        <a href="/login">Login</a>
                                    </div>
                                    <div className="login">
                                        <a href="/register">Register</a>
                                    </div>

                                </div> :
                                <div>{
                                    currentLocation.pathname !== "/history" ?
                                        <div className="login">
                                            <a href={"/history"}>History</a>
                                        </div> : ""}
                                    <div className="login">
                                        <a onClick={() => logout()}>logout</a>
                                    </div>
                                </div>

                        }

                    </div>
                </div>
                <Routes>

                    <Route path={"/"} element={
                        <ProtectedRoute>
                            <HomePage/>
                        </ProtectedRoute>
                    }/>
                    <Route path={"/topic_detail"} element={

                        <ProtectedRoute>
                            <TopicDetails/>
                        </ProtectedRoute>

                    }/>
                    <Route path={"/progressbar"} element={

                        <ProtectedRoute>
                            <ProgressBar/>
                        </ProtectedRoute>

                    }/> <Route path={"/history"} element={

                    <ProtectedRoute>
                        <HistoryPage/>
                    </ProtectedRoute>

                }/>
                    <Route path={"/login"} element={<LoginPage/>}/>
                    <Route path={"/register"} element={<LoginPage/>}/>
                </Routes>

            </DataContext.Provider>
        </div>
    );
}

export default App;
