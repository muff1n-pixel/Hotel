import useRoomItemScreenPosition from "../Hooks/useRoomItemScreenPosition";
import { useRoomInstance } from "../../../../Hooks2/useRoomInstance";
import { RoomUser } from "@Client/Room/RoomInstance";
import UserLink from "@UserInterface/Common/Users/UserLink";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { webSocketClient } from "@Game/index";
import { UpdateUserFriendRequestData } from "@pixel63/events";
import { useState } from "react";

export type RoomUserFriendRequestMenuProps = {
    user: RoomUser;
}

export default function RoomUserFriendRequestMenu({ user }: RoomUserFriendRequestMenuProps) {
    const room = useRoomInstance();
    const position = useRoomItemScreenPosition(user.item);

    const [minimized, setMinimized] = useState(false);

    if(room?.roomRenderer.focusedItem.value?.id === user.item.id) {
        return null;
    }

    if(minimized) {
        return null;
    }

    return (
        <div style={{
            position: "absolute",
            whiteSpace: "nowrap",

            left: position?.left,
            top: position?.top
        }}>
            <div className="arrow arrow-orange" style={{
                display: "flex",

                transform: "translate(64px, -58px) translate(-50%, -100%)",

                width: 164,

                background: "#B59011",
                border: "1px solid #000000",
                borderBottomWidth: 2,
                borderRadius: 5,

                pointerEvents: "auto"
            }}>
                <div style={{
                    flex: 1,
                    border: "1px solid #F9C818",
                    borderRadius: 5,
                    boxSizing: "border-box",

                    fontSize: 12,

                    padding: 5,

                    flexWrap: "wrap",

                    display: "flex",
                    gap: 10
                }}>
                    <div style={{
                        flex: 1,

                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <div style={{
                            fontFamily: "Ubuntu Medium"
                        }}>
                            <div>Friend request from</div>
                            
                            <UserLink id={user.data.id} name={user.data.name}/>
                        </div>

                        <div style={{
                            cursor: "pointer"
                        }} onClick={() => setMinimized(true)}>
                            <div className="sprite_dialog_close"/>
                        </div>
                    </div>
                    
                    <div style={{
                        flex: 1,

                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div style={{
                            flex: 1,

                            cursor: "pointer",

                            textDecoration: "underline"
                        }} onClick={() => {
                            webSocketClient.sendProtobuff(UpdateUserFriendRequestData, UpdateUserFriendRequestData.create({
                                userId: user.data.id,
                                accept: false
                            }));
                        }}>
                            Decline
                        </div>

                        <DialogButton style={{
                            flex: 1,

                            height: 20,

                            fontSize: 11,
                            fontFamily: "Ubuntu Bold"
                        }} onClick={() => {
                            webSocketClient.sendProtobuff(UpdateUserFriendRequestData, UpdateUserFriendRequestData.create({
                                userId: user.data.id,
                                accept: true
                            }));
                        }}>
                            Accept
                        </DialogButton>
                    </div>
                </div>

                <div className="arrow-outline"/>
            </div>
        </div>
    );
}