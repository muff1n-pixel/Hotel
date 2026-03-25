import './HomeWidgetProfile.css';
import { HomeUserType } from "../../../../../../Pages/HomePage/HomePage";
import Skeleton from '../../../../../../Images/community/habbo_skeleton.gif';
import AvatarImager from '../../../../../../../../Utils/AvatarImager/AvatarImager';
import OnlineImage from '../../../../../../Images/state/online.gif';
import OfflineImage from '../../../../../../Images/state/offline.gif';
import { act, useEffect, useState } from 'react';
import DateFormatter from '../../../../../../../../Utils/DateFormatter/DateFormatter'

type HomeWidgetProfileProps = {
    activeUser: HomeUserType,
    borderSkin: string | null
}

export const HomeWidgetProfile = ({ activeUser, borderSkin }: HomeWidgetProfileProps) => {
    const [avatar, setAvatar] = useState<string>(Skeleton);

    useEffect(() => {
        AvatarImager(activeUser.figureConfiguration, 4).then((avatarData) => {
            setAvatar(avatarData);
        }).catch((e) => {
            console.log("Failed to load avatar image:", e);
        });
    }, [])

    return (
        <div className={`profileWidget widget skin ${borderSkin}`}>
            <div className="widgetCorner">
                <div className="widgetHeadline">
                    <div className='widgetTitle'>Profile</div>
                </div>
            </div>

            <div className="widgetBody">
                <div className="widgetContent">
                    <div className='avatar' style={{ backgroundImage: `url(${avatar})` }}></div>

                    <div className='data'>
                        <div className='username'><span>{activeUser.name}</span> <img src={activeUser.online ? OnlineImage : OfflineImage} alt='State' /></div>
                        <div className='motto'>{activeUser.motto}</div>
                        <div className='date'>Registered: <span>{DateFormatter(activeUser.registered)}</span></div>
                        <div className='date'>Last login: <span>{!activeUser.lastLogin ? 'Never' : DateFormatter(activeUser.lastLogin)}</span></div>
                        
                        <div className='badges'>
                            {
                                activeUser.currentBadges.map((badge) => {
                                    return (
                                        <img src={`/assets/badges/${badge}`} alt={badge} key={badge} />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeWidgetProfile;