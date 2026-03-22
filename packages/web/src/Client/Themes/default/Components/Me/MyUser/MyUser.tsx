import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Button from "../../Button/Button";
import AvatarImager from "../../../../../Utils/AvatarImager/AvatarImager";

import creditIcon from '../../../Images/me/creditIcon.png';
import friendsIcon from '../../../Images/icons/medium/friends.gif';
import tradeOnIcon from '../../../Images/icons/small/trade_on.png';
import tradeOffIcon from '../../../Images/icons/small/trade_off.png';
import ducketsIcon from '../../../Images/me/duckets.png';
import keyIcon from '../../../Images/me/key.gif'
import clockIcon from '../../../Images/me/clock.gif'
import discordIcon from '../../../Images/me/discord.png'
import diamondsIcon from '../../../Images/me/diamonds.png';
import UnknowUserImage from '../../../Images/unknow_user.gif';
import mottoIcon from '../../../Images/icons/small/pen.png';

import { ThemeContext } from "../../../ThemeProvider";
import { NavLink } from "react-router";
import MyUserFriends from "./Friends/MyUserFriends";
import TimeAgo from '../../../../../Utils/DateFormatter/DateFormatter'

const MyUser = () => {
    const [myAvatar, setMyAvatar] = useState<string>(UnknowUserImage);
    const [newMotto, setNewMotto] = useState<string>("");
    const [editMotto, setEditMotto] = useState<boolean>(false);
    const mottoInputRef = useRef<HTMLInputElement>(null);
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

    const startEditMotto = () => {
        setEditMotto(true);

        setTimeout(() => {
            mottoInputRef.current?.focus();
        }, 0);
    }

    const handleSubmitMotto = useCallback(() => {
        if (!newMotto.trim()) {
            setEditMotto(false);
            setNewMotto("")
            return
        }

        fetch("/api/settings/motto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                newMotto
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error) {
                    setEditMotto(false);
                    setNewMotto("")
                    return;
                }

                const newUser = Object.create(
                    Object.getPrototypeOf(currentUser),
                    Object.getOwnPropertyDescriptors(currentUser)
                );

                newUser.motto = newMotto;

                dispatch({ currentUser: newUser });
                setEditMotto(false);
                setNewMotto("")
            });
    }, [newMotto]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                mottoInputRef.current &&
                !mottoInputRef.current.contains(event.target as Node)
            ) {
                setEditMotto(false);
                setNewMotto("")
            }
        };

        if (editMotto) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editMotto]);

    useEffect(() => {
        if (!currentUser)
            return;

        AvatarImager(currentUser.figureConfiguration).then((avatarData: Base64URLString) => {
            setMyAvatar(avatarData);
        }).catch((e: any) => {
            console.log("Failed to load avatar image:", e);
        });
    }, [currentUser]);

    return (
        <div className='myUser'>
            <div className='hotelView'>
                <div className='enterButton'>
                    <div className='bg'></div>
                    <Button color='green' size='medium' onClick={() => window.open("/game", "_blank", "noopener,noreferrer")}>Enter Hotel <div className='arrow'></div></Button>
                </div>
            </div>
            <div className='myData'>
                <div className='my_avatar'>
                    <div className='avatar'>
                        <div className='avatar_img' style={{ backgroundImage: `url(${myAvatar})` }}></div>
                    </div>

                    <div className={`motto ${editMotto ? "active" : ""}`} onClick={() => startEditMotto()}>
                        <span>{currentUser?.name}: </span>
                        {editMotto ?
                            <input ref={mottoInputRef} type="text" placeholder="New motto..." value={newMotto} onChange={(e) => setNewMotto(e.target.value)} maxLength={40} onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmitMotto();
                                }
                            }}></input>
                            :
                            <>
                                {currentUser?.motto}
                                <img src={mottoIcon} alt="Motto Icon" />
                            </>
                        }
                    </div>
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
                    <p>Last signed in: {currentUser?.lastLogin ? TimeAgo(currentUser.lastLogin) : "Never"}</p>
                </div>
            </div>
        </div>
    )
}

export default MyUser;