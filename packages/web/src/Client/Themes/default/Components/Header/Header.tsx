import './Header.css'
import Logo from '../../Images/logo.gif'
import Button from '../Button';
import { NavLink, useLocation, useMatch, useNavigate } from 'react-router';
import { use, useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../ThemeProvider';
import { useCookies } from 'react-cookie';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const settingsMatch = useMatch("/settings/*");
    const [usersOnlines, setUsersOnlines] = useState<number>(0);
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

    const fetchOnlines = () => {
        fetch("/api/hotel/information", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => response.json())
            .then((result) => {
                setUsersOnlines(result.usersOnline);
            })
            .catch((e) => {
                console.log("(Error) Impossible to fetch server stats:", e)
            })
    }


    useEffect(() => {
        fetchOnlines();

        const intervalId = setInterval(() => {
            fetchOnlines();
        }, 60000);

        if (!currentUser && cookies.accessToken) {
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
                });
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [fetchOnlines, setInterval, clearInterval, cookies.accessToken, removeCookie, navigate, dispatch, currentUser]);

    const generateSubMenu = () => {
        switch (location.pathname) {
            case "/community":
            case "/article": 
            {
                return (
                    <nav className='submenu'>
                        <NavLink to="/community">Community</NavLink>
                        <NavLink to="/article">Articles</NavLink>
                        <NavLink to="/staff">Staff</NavLink>
                        <NavLink to="/forums">Forums</NavLink>
                    </nav>
                )
            }

            default: {
                if (currentUser)
                    return (
                        <nav className='submenu'>
                            <NavLink to="/me">{currentUser.name}</NavLink>
                            <NavLink to="/settings">Account Settings</NavLink>
                        </nav>
                    )
                else
                    return (
                        <nav className='submenu'>
                            <NavLink to="/">Login</NavLink>
                            <NavLink to="/">Register</NavLink>
                        </nav>
                    )
                break;
            }
        }
    }

    return (
        <header>
            <div className='top_content'>
                <div className='resize'>
                    <div className='content'>
                        <div className='logo' onClick={() => navigate("/me")}><img src={Logo} alt="Logo" /></div>

                        <div className='alert_message'>
                            <div className='message'><span>Hey:</span> Welcome on Pixel63 project!</div>

                            <div className='navigation'>
                                {currentUser !== null ?
                                    <a href="/logout">Logout</a>
                                    :
                                    <a href="/">Login</a>
                                }
                            </div>
                        </div>

                        {currentUser !== null && <Button color='green' onClick={() => window.location.href = "/game"}>Enter Pixel63</Button>}
                    </div>

                    <div className='onlines'>
                        <span>{usersOnlines}</span> players online
                    </div>

                    <nav>
                        {currentUser !== null ? <NavLink to="/me" className={({ isActive }) => isActive || settingsMatch ? "active" : ""}>{currentUser.name}</NavLink> : <NavLink to="/">Login</NavLink>}
                        <NavLink to="/community">Community</NavLink>
                        {currentUser !== null && <NavLink to="/shop">Shop</NavLink>}
                    </nav>
                </div>
            </div>

            <div className='resize'>
                {generateSubMenu()}
            </div>
        </header>
    )
}

export default Header;