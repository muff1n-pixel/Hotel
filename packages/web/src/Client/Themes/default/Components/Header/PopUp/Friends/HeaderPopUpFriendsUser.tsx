import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Skeleton from '../../../../Images/community/habbo_skeleton.gif';
import AvatarImager from "../../../../../../Utils/AvatarImager/AvatarImager";
import OnlineImage from '../../../../Images/state/online.gif';
import OfflineImage from '../../../../Images/state/offline.gif';

type UserProps = {
    name: string;
    motto: string;
    figureConfiguration: object;
    online: boolean;
}

const HeaderPopUpFriendsUser = (user: UserProps) => {
    const [avatar, setAvatar] = useState<string>(Skeleton);
    const navigate = useNavigate();

    useEffect(() => {
        AvatarImager(user.figureConfiguration, 2).then((avatarData) => {
            setAvatar(avatarData);
        }).catch((e) => {
            console.log("Failed to load avatar image:", e);
        });
    })

    return (
        <div className="row user" onClick={() => navigate(`/home/${user.name}`)}>
            <div className="avatar" style={{ backgroundImage: `url(${avatar})` }}></div>
            <div className="userData">
                <div className="username"><span>{user.name}</span><img src={user.online ? OnlineImage : OfflineImage} alt='State' /></div>
                <div className="motto">{user.motto}</div>
            </div>
        </div>
    )
}

export default HeaderPopUpFriendsUser;