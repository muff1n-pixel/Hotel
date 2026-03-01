import FigureImage from "../../../Figure/FigureImage";
import { useUserBadges } from "../../../../hooks/useUserBadges";
import BadgeImage from "../../../Badges/BadgeImage";
import { useUser } from "../../../../hooks/useUser";
import { useCallback } from "react";
import "./RoomUserProfile.css";
import { webSocketClient } from "../../../../..";
import RoomUserProfileMotto from "./RoomUserProfileMotto";
import { RoomUserData, SetUserMottoData } from "@pixel63/events";

export type RoomUserProfileProps = {
    user: RoomUserData;
}

export default function RoomUserProfile({ user: targetUser }: RoomUserProfileProps) {
    const user = useUser();

    const badges = useUserBadges(targetUser.id);

    const handleMottoChange = useCallback((motto: string) => {
        if(targetUser.id !== user?.id) {
            return;
        }

        webSocketClient.sendProtobuff(SetUserMottoData, SetUserMottoData.create({
            motto
        }));
    }, [targetUser, user]);

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
                    {(targetUser.figureConfiguration) && (
                        <FigureImage figureConfiguration={targetUser.figureConfiguration} direction={2}/>
                    )}
                </div>

                <div style={{
                    width: 40 + 40 + 4,

                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                    gap: 4
                }}>
                    {badges.toReversed().map((badge) => (
                        <div style={{
                            width: 40,
                            height: 40
                        }}>
                            <BadgeImage badge={badge}/>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                width: "100%",
                height: 1,
                background: "#333333"
            }}/>

            <RoomUserProfileMotto canEdit={user.id == targetUser.id} value={targetUser.motto ?? ""} onChange={handleMottoChange}/>
        </div>
    );
}
