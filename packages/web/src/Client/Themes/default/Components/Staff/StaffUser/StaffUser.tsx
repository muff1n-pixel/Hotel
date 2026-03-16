import { useEffect, useState } from 'react';
import './StaffUser.css';
import Unknow_User from '../../../Images/unknow_user.gif';
import AvatarImager from '../../../../../Utils/AvatarImager/AvatarImager';
import OnlineImage from '../../../Images/state/online.gif';
import OfflineImage from '../../../Images/state/offline.gif';

export type StaffUserType = {
    id: string;
    name: string;
    role: string;
    motto: string;
    figureConfiguration: any;
    online: boolean;
    currentBadges: Array<string>
}

const StaffUser = (props: StaffUserType) => {
    const [avatar, setAvatar] = useState<string>(Unknow_User);

    useEffect(() => {
        AvatarImager(props.figureConfiguration, 2).then((avatarData) => {
            setAvatar(avatarData);
        }).catch((e) => {
            console.log("Failed to load avatar image:", e);
        });
    }, [])

    return (
        <div className='staffUser'>
            <div className='avatar' style={{ backgroundImage: `url(${avatar})` }}></div>

            <div className='infos'>
                <div className='username'>{props.name} <img src={props.online ? OnlineImage : OfflineImage} alt='State' /></div>
                <div className='role'>{props.role}</div>
                <div className='motto'>{props.motto}</div>
                <div className='badges'>
                    {
                        props.currentBadges.map((badge) => {
                            return (
                                <img src={`/assets/badges/${badge}.gif`} alt={badge} key={badge} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default StaffUser;