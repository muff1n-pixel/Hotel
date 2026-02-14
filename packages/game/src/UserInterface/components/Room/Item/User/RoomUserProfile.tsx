import { RoomUserData } from "@Shared/Interfaces/Room/RoomUserData";
import FigureImage from "../../../Figure/FigureImage";
import { useUserProfile } from "../../../../hooks/useUserProfile";
import BadgeImage from "../../../Badges/BadgeImage";
import { useUser } from "../../../../hooks/useUser";
import { useCallback, useEffect, useState } from "react";
import { SetMottoEventData } from "@Shared/Communications/Requests/User/SetMottoEventData";
import "./RoomUserProfile.css";
import { webSocketClient } from "../../../../..";

export type RoomUserProfileProps = {
    user: RoomUserData;
}

export default function RoomUserProfile({ user: targetUser }: RoomUserProfileProps) {
    const user = useUser();

    const profile = useUserProfile(targetUser.id);

    const [editMotto, setEditMotto] = useState(false);
    const [motto, setMotto] = useState(profile?.motto ?? "");

    useEffect(() => {
        setMotto(profile?.motto ?? "");
    }, [profile]);

    const handleMottoChange = useCallback(() => {
        if(targetUser.id !== user?.id) {
            return;
        }

        webSocketClient.send<SetMottoEventData>("SetMottoEvent", {
            motto
        });

        setEditMotto(false);
    }, [targetUser, user, motto]);

    if(!profile) {
        return null;
    }

    return (
        <div style={{
            background: "rgba(61, 61, 61, .95)",
            padding: 10,
            borderRadius: 6,
            fontSize: 11,

            pointerEvents: "auto",

            minWidth: 170,

            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>

            <b>{targetUser.name}</b>

            <div style={{
                width: "100%",
                height: 1,
                background: "#333333"
            }}/>

            <div style={{
                display: "flex",
                gap: 6
            }}>
                <div style={{
                    background: "rgba(255, 255, 255, .1)",
                    border: "1px solid #000",
                    borderRadius: 6,

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    boxSizing: "border-box",

                    width: 67,
                    height: 130
                }}>
                    <FigureImage figureConfiguration={targetUser.figureConfiguration} direction={2}/>
                </div>

                <div style={{
                    width: 40 + 40 + 4,

                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                    gap: 4
                }}>
                    {profile?.badges.toReversed().map((userBadge) => (
                        <div style={{
                            width: 40,
                            height: 40
                        }}>
                            <BadgeImage badge={userBadge.badge}/>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                width: "100%",
                height: 1,
                background: "#333333"
            }}/>

            <div style={{
                width: "100%",

                background: "rgba(255, 255, 255, .1)",
                border: "1px solid #000",
                borderRadius: 6,

                display: "flex",
                flexDirection: "row",
                gap: 2,

                padding: "2px 4px",
                boxSizing: "border-box",

                alignItems: "center"
            }} onClick={() => (targetUser.id === user?.id && !editMotto) && setEditMotto(true)}>
                {(targetUser.id === user?.id) && (
                    <div className="sprite_room_user_motto_pen"/>
                )}

                {(editMotto)?(
                    <input className="room-user-profile-motto" autoFocus maxLength={40} value={motto ?? ""} onChange={(event) => setMotto((event.target as HTMLInputElement).value)} onKeyDown={(event) => event.key === "Enter" && handleMottoChange()}/>
                ):(
                    <div style={{
                        maxWidth: 130,
                        fontSize: 11,
                        textWrap: "wrap",
                        textOverflow: "clip"
                    }}>
                        {motto}
                    </div>
                )}
            </div>
        </div>
    );
}
