import BadgeImage from "../../../Badges/BadgeImage";
import FigureImage from "../../../Figure/FigureImage";
import "../User/RoomUserProfile.css";
import RoomBot from "@Client/Room/Bots/RoomBot";
import RoomUserProfileMotto from "../User/RoomUserProfileMotto";
import { useUser } from "../../../../hooks/useUser";
import { useCallback } from "react";
import { webSocketClient } from "../../../../..";
import { UpdateRoomBotData } from "@pixel63/events";

export type RoomBotProfileProps = {
    bot: RoomBot;
}

export default function RoomBotProfile({ bot }: RoomBotProfileProps) {
    const user = useUser();

    const handleMottoChange = useCallback((motto: string) => {
        webSocketClient.sendProtobuff(UpdateRoomBotData, UpdateRoomBotData.create({
            id: bot.data.id,

            motto
        }));
    }, [bot]);

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

            <b>{bot.data.name}</b>

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
                    height: 130,
                    
                    position: "relative"
                }}>
                    <div className="sprite_room_user_bot" style={{
                        position: "absolute",

                        left: 0,
                        top: 0,

                        opacity: 0.5
                    }}/>

                    <FigureImage figureConfiguration={bot.data.figureConfiguration} direction={2} style={{
                        position: "relative"
                    }}/>
                </div>

                <div style={{
                    width: 40 + 40 + 4,

                    display: "flex",
                    flexDirection: "row",

                    alignItems: "center",
                    justifyContent: "center",
                    
                    gap: 4
                }}>
                    <div style={{
                        width: 40,
                        height: 40
                    }}>
                        <BadgeImage badge={{
                            $type: "BadgeData",
                            id: "bot",
                            image: "BOT.gif",
                            name: "Bot",
                            description: "Bot"
                        }}/>
                    </div>
                </div>
            </div>

            <div style={{
                width: "100%",
                height: 1,
                background: "#333333"
            }}/>

            <RoomUserProfileMotto canEdit={user.id === bot.data.userId} value={bot.data.motto} onChange={handleMottoChange}/>
        </div>
    );
}
