import "./IndexPage.css";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import LoginSection from "../../Components/Index/LoginSection";
import RegistrationSection from "../../Components/Index/RegistrationSection";
import { ThemeContext } from "../../ThemeProvider";
import { useLocation, useNavigate } from "react-router";

const IndexPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/me";
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

    const [showRegistration, setShowRegistration] = useState(false);

    useEffect(() => {
        if (cookies.accessToken) {
            fetch("/api/loginAuth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                })
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.error) {
                        dispatch({ currentUser: null })
                        removeCookie("accessToken");

                        return;
                    }

                    dispatch({ currentUser: result });
                    navigate(from, { replace: true });
                });
        }
    }, [cookies.accessToken, removeCookie, navigate, dispatch, currentUser]);

    return (
        <div className="index" style={{
            color: "#e0eff5",
            backgroundColor: "#007498",
            backgroundImage: `url(${new URL('../../Images/index/background.png', import.meta.url).toString()}), radial-gradient(circle farthest-side at 190px 190px, #0297c8 0, #007498 480px)`,

            overflow: "hidden"
        }}>
            <div style={{
                transform: (showRegistration) ? ("translateY(-100vh)") : ("translateY(0vh)"),
                transition: "transform 1.5s"
            }}>
                <LoginSection showRegistration={() => setShowRegistration(true)} />

                <RegistrationSection />
            </div>
        </div>
    );
}

export default IndexPage;