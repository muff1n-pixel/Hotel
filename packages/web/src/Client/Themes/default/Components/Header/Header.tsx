import './Header.css'
import Logo from '../../Images/logo.gif'
import Button from '../Button';
import { NavLink, useNavigate } from 'react-router';
import { use, useContext } from 'react';
import { ThemeContext } from '../../ThemeProvider';

const Header = () => {
    const navigate = useNavigate();
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

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
                        <span>?</span> players online
                    </div>

                    {currentUser !== null ?
                        <nav>
                            <NavLink to="/me">{currentUser.name}</NavLink>
                            <NavLink to="/community">Community</NavLink>
                            <NavLink to="/shop">Shop</NavLink>
                        </nav>
                        :
                        <nav>
                            <NavLink to="/">Login</NavLink>
                        </nav>
                    }
                </div>
            </div>

            <div className='resize'>
                {currentUser !== null ?
                    <nav className='submenu'>
                        <NavLink to="/me">{currentUser.name}</NavLink>
                        <NavLink to="/settings">Account Settings</NavLink>
                    </nav>
                    : <nav className='submenu'>
                        <NavLink to="">Login</NavLink>
                        <NavLink to="/">Register</NavLink>
                    </nav>}
            </div>
        </header>
    )
}

export default Header;