import { HomeUserType, GuestbookMessage } from "../../../../../../../Pages/HomePage/HomePage";
import Skeleton from '../../../../../../../Images/community/habbo_skeleton.gif';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AvatarImager from "../../../../../../../../../Utils/AvatarImager/AvatarImager";
import DateFormatter from "../../../../../../../../../Utils/DateFormatter/DateFormatter";
import CrossIcon from '../../../../../../../Images/icons/small/cross.gif'
import { ThemeContext } from "../../../../../../../ThemeProvider";

type HomeWidgetGuestbookMessageProps = {
    message: GuestbookMessage;
    activeUser: HomeUserType;
    deleteMessage: (id: string) => void;
}

const HomeWidgetGuestbookMessage = ({message, activeUser, deleteMessage}: HomeWidgetGuestbookMessageProps) => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [avatar, setAvatar] = useState<string>(Skeleton);
    const navigate = useNavigate();

    useEffect(() => {
        AvatarImager(message.user.figureConfiguration, 2, [], true).then((avatarData) => {
            setAvatar(avatarData);
        }).catch((e) => {
            console.log("Failed to load avatar image:", e);
        });
    })

    return (
        <div className="row">
            <div className="avatar" style={{ backgroundImage: `url(${avatar})` }} onClick={() => navigate(`/home/${message.user.name}`)}></div>

            <div className="data">
                <div className="username"><span onClick={() => navigate(`/home/${message.user.name}`)}>{message.user.name}</span> {currentUser && activeUser.id === currentUser.id && <img src={CrossIcon} className='delete' alt='Delete' onClick={() => deleteMessage(message.id)}/>}</div>
                <div className="messageData">{message.message}</div>
                <div className="date">{DateFormatter(message.date)}</div>
            </div>
        </div>
    )
}

export default HomeWidgetGuestbookMessage