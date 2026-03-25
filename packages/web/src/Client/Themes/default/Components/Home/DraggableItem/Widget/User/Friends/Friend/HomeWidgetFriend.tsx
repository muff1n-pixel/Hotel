import { HomeOtherUserType } from "../../../../../../../Pages/HomePage/HomePage";
import Skeleton from '../../../../../../../Images/community/habbo_skeleton.gif';
import OnlineImage from '../../../../../../../Images/state/online.gif';
import OfflineImage from '../../../../../../../Images/state/offline.gif';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AvatarImager from "../../../../../../../../../Utils/AvatarImager/AvatarImager";

const HomeWidgetFriend = (user: HomeOtherUserType) => {
    const [avatar, setAvatar] = useState<string>(Skeleton);
    const navigate = useNavigate();

    useEffect(() => {
        AvatarImager(user.figureConfiguration, 2, [], true).then((avatarData) => {
            setAvatar(avatarData);
        }).catch((e) => {
            console.log("Failed to load avatar image:", e);
        });
    })

    return (
        <div className="row" onClick={() => navigate(`/home/${user.name}`)}>
            <div className="avatar" style={{ backgroundImage: `url(${avatar})` }}></div>

            <div className="data">
                <div className="name">
                    <span>{user.name}</span>
                    <img src={user.online ? OnlineImage : OfflineImage} alt='State' />
                </div>
                <div className="motto">{user.motto}</div>
            </div>
        </div>
    )
}

export default HomeWidgetFriend