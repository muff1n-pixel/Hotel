import { NavLink, useLocation, useNavigate, useParams } from 'react-router';
import './SettingsPage.css'
import { useContext, useEffect, useState } from 'react';
import passwordIcon from '../../Images/settings/password.gif';
import mailIcon from '../../Images/settings/mail.gif';
import friendsIcon from '../../Images/settings/friends.gif';
import tradeIcon from '../../Images/icons/small/tools_edit.gif';
import { ThemeContext } from '../../ThemeProvider';
import SettingsEmailForm from '../../Components/Settings/EmailForm';
import SettingsPasswordForm from '../../Components/Settings/PasswordForm';
import SettingsFriendsForm from '../../Components/Settings/FriendsForm';
import SettingsTradeForm from '../../Components/Settings/TradeForm';

const SettingsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { section } = useParams();
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

    const getComposantBySection = () => {
        switch (section) {
            case "password":
                return <SettingsPasswordForm />

            case "friends":
                return <SettingsFriendsForm />

            case "trade":
                return <SettingsTradeForm />

            default:
                return <SettingsEmailForm />
        }
    }


    useEffect(() => {
        if (!currentUser) {
            navigate("/", {
                state: { from: location },
                replace: true,
            });
        }
        switch (section) {
            case "password":
            case "friends":
            case "email":
            case "trade":
                break;

            default:
                navigate("/settings/email")
                break;
        }
    }, [currentUser, navigate]);

    return (
        <div className="settingsPage resize">
            <div className='grid first_small'>
                <div className='box'>
                    <nav className='navigation'>
                        <NavLink to={'/settings/email'}><img src={mailIcon} alt="Email Icon" /> Email</NavLink>
                        <NavLink to={'/settings/password'}><img src={passwordIcon} alt="Password Icon" /> Password</NavLink>
                        <NavLink to={'/settings/friends'}><img src={friendsIcon} alt="Friends Icon" /> Friends</NavLink>
                        <NavLink to={'/settings/trade'}><img src={tradeIcon} alt="Trade Icon" /> Trade</NavLink>
                    </nav>
                </div>

                {getComposantBySection()}
            </div>
        </div>
    )
}

export default SettingsPage;