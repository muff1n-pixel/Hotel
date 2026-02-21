import { useEffect } from "react";
import { useCookies } from "react-cookie";

const LogoutPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

    useEffect(() => {
        if(cookies.accessToken) {
            removeCookie("accessToken");
            
            window.location.href = "/";
        }
    }, [cookies.accessToken]);

    return null;
}

export default LogoutPage;