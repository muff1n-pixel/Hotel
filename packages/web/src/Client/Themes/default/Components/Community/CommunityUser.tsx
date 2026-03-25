import { useEffect, useState } from "react";
import Skeleton from '../../Images/community/habbo_skeleton.gif';
import AvatarImager from '../../../../Utils/AvatarImager/AvatarImager'
import { useNavigate } from "react-router";

type UserProps = {
    name?: string | null;
    motto?: string | null;
    figureConfiguration?: object | null;
}

const CommunityUser = ({ name = null, motto = null, figureConfiguration = null }: UserProps) => {
    const [avatar, setAvatar] = useState<string>(Skeleton);
    const navigate = useNavigate();

    useEffect(() => {
        if (name && motto && figureConfiguration) {
            AvatarImager(figureConfiguration, 4).then((avatarData) => {
                setAvatar(avatarData);
            }).catch((e) => {
                console.log("Failed to load avatar image:", e);
            });
        }
    })

    return (
        <div className='row' style={{ backgroundImage: `url(${avatar})` }} onClick={() => navigate(`/home/${name}`)}>
            {name &&
                <div className='info'>
                    <div className='username'>{name}</div>
                    <div className='motto'>{motto}</div>
                </div>
            }
        </div>
    )
}

export default CommunityUser;