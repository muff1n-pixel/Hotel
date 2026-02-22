import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { ThemeContext } from "../../ThemeProvider";
import { useNavigate } from "react-router";

const LogoutPage = () => {
    const navigate = useNavigate();
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

    useEffect(() => {
        if(cookies.accessToken) {
            dispatch({currentUser: null})
            removeCookie("accessToken");
            
            navigate("/");            
        }
    }, [cookies.accessToken, navigate, removeCookie, dispatch]);

    return null;
}

export default LogoutPage;