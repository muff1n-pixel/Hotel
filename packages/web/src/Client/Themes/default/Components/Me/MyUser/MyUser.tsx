import { useContext, useEffect, useState } from "react";
import Button from "../../Button";
import AvatarImager from "../../../../../Utils/AvatarImager/AvatarImager";

import creditIcon from '../../../Images/me/creditIcon.png';
import friendsIcon from '../../../Images/icons/medium/friends.gif';
import tradeOnIcon from '../../../Images/icons/small/check.gif';
import tradeOffIcon from '../../../Images/icons/small/cross.gif';
import ducketsIcon from '../../../Images/me/duckets.png';
import keyIcon from '../../../Images/me/key.gif'
import clockIcon from '../../../Images/me/clock.gif'
import discordIcon from '../../../Images/me/discord.png'
import diamondsIcon from '../../../Images/me/diamonds.png';
import UnknowUserImage from '../../../Images/unknow_user.gif';

import { ThemeContext } from "../../../ThemeProvider";
import { NavLink } from "react-router";
import MyUserFriends from "./Friends/MyUserFriends";

const MyUser = () => {
    const [myAvatar, setMyAvatar] = useState<string>(UnknowUserImage);
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

    useEffect(() => {
        if(!currentUser)
            return;

        AvatarImager(currentUser.figureConfiguration).then((avatarData: Base64URLString) => {
            setMyAvatar(avatarData);
        }).catch((e: any) => {
            console.log("Failed to load avatar image:", e);
        });
    }, [currentUser]);

    return (
        <div className='my_user'>
            <div className='hotel_view'>
                <div className='enter_button'>
                    <div className='bg'></div>
                    <Button color='green' size='medium' onClick={() => window.open("/game", "_blank", "noopener,noreferrer")}>Enter Hotel <div className='arrow'></div></Button>
                </div>
            </div>
            <div className='my_data'>
                <div className='my_avatar'>
                    <div className='avatar'>
                        <div className='avatar_img' style={{ backgroundImage: `url(${myAvatar})` }}></div>
                    </div>

                    <div className='motto'><span>{currentUser?.name}: </span> {currentUser?.motto}</div>
                </div>

                <div className='bank'>
                    <div className='row'><img src={creditIcon} alt="Credits Icon" /> <span>{currentUser?.credits}</span> Credits</div>
                    <div className='row'><img src={ducketsIcon} alt="Duckets Icon" /> <span>{currentUser?.duckets}</span> Duckets</div>
                    <div className='row'><img src={diamondsIcon} alt="Diamonds Icon" /> <span>{currentUser?.diamonds}</span> Diamonds</div>
                </div>
            </div>

            <div className='row'>
                <img src={keyIcon} alt="Key Icon" />
                <div className='description'>
                    <h2>Hey {currentUser?.name}, safety first!</h2>
                    <p>Do not share any of your personal data with anyone on our game, you never know who you might encounter!</p>
                </div>
            </div>
            <div className='row'>
                <img src={discordIcon} alt="Discord Icon" />
                <div className='description'>
                    <h2>Join our community!</h2>
                    <p>Be part of the adventure and join us by clicking <a href="/discord" target='_blank'>here</a>!</p>
                </div>
            </div>
            <div className='row medium'>
                <img src={friendsIcon} alt="Friends Icon" />
                <div className='description'>
                    <MyUserFriends />
                </div>
            </div>
            <div className='row small'>
                <img src={currentUser?.preferences.allowTrade ? tradeOnIcon : tradeOffIcon} alt="Trade Icon" />
                <div className='description'>
                    {currentUser?.preferences.allowTrade ? (
                        <>
                            Trading is on{" "}
                            <NavLink to="/settings/trade">
                                Click here to turn it off
                            </NavLink>
                        </>
                    ) : (
                        <>
                            Trading is off{" "}
                            <NavLink to="/settings/trade">
                                Click here to turn it on
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
            <div className='row small'>
                <img src={clockIcon} alt="Clock Icon" />
                <div className='description'>
                    <p>Last signed in: {currentUser?.lastLogin ? (new Date(currentUser.lastLogin).toLocaleString()).replace(" ", " at ") : "Never"}</p>
                </div>
            </div>
        </div>
    )
}

export default MyUser;