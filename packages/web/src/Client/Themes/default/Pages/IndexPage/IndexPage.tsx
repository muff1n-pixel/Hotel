import "./IndexPage.css";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import LoginSection from "../../Components/Index/LoginSection";
import RegistrationSection from "../../Components/Index/RegistrationSection";

const IndexPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
    
    const [showRegistration, setShowRegistration] = useState(false);
    
    useEffect(() => {
        if(cookies.accessToken) {
            window.location.href = "/game/";
        }
    }, [cookies.accessToken]);

    return (
        <div className="index" style={{
            color: "#e0eff5",
            backgroundColor: "#007498",
            backgroundImage: `url(${new URL('../../Images/index/background.png', import.meta.url).toString()}), radial-gradient(circle farthest-side at 190px 190px, #0297c8 0, #007498 480px)`,

            overflow: "hidden"
        }}>
            <div style={{
                transform: (showRegistration)?("translateY(-100vh)"):("translateY(0vh)"),
                transition: "transform 1.5s"
            }}>
                <LoginSection showRegistration={() => setShowRegistration(true)}/>

                <RegistrationSection/>
            </div>
        </div>
    );
}

export default IndexPage;