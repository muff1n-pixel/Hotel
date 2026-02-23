import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import "./UserContextMenu.css";
import UserContextMenuList from "./UserContextMenuList";
import UserContextMenuButton from "./UserContextMenuButton";
import UserContextMenuElement from "./UserContextMenuElement";
import { webSocketClient } from "../../../..";
import { useDialogs } from "../../../hooks/useDialogs";
import { useUser } from "../../../hooks/useUser";
import { useRoomInstance } from "../../../hooks/useRoomInstance";
import { UpdateUserRightsEventData } from "@Shared/Communications/Requests/Rooms/User/UpdateUserRightsEventData";
import { useRoomHoveredUser } from "../../../hooks/useRoomHoveredUser";
import { useRoomFocusedUser } from "../../../hooks/useRoomFocusedUser";
import { PickupRoomBotEventData } from "@Shared/Communications/Requests/Rooms/Bots/PickupRoomBotEventData"

export default function UserContextMenu() {
    const room = useRoomInstance();

    const focusedUser = useRoomFocusedUser(room);
    const hoveredUser = useRoomHoveredUser(room);

    const user = useUser();

    const { addUniqueDialog } = useDialogs();

    const elementRef = useRef<HTMLDivElement>(null);

    const [folded, setFolded] = useState<boolean>(false);

    useEffect(() => {
        if(!elementRef.current) {
            return;
        }

        if(focusedUser) {
            return;
        }

        if(!room) {
            return;
        }

        if(!hoveredUser) {
            return;
        }

        const listener = () => {
            if(!elementRef.current) {
                return;
            }

            const position = room.roomRenderer.getItemScreenPosition(hoveredUser.item);

            elementRef.current.style.left = `${position.left}px`;
            elementRef.current.style.top = `${position.top}px`;
        };

        room.roomRenderer.addEventListener("render", listener);
  
        return () => {
            room.roomRenderer.removeEventListener("render", listener);
        };
    }, [hoveredUser, room, focusedUser, elementRef.current]);

    useEffect(() => {
        if(!elementRef.current) {
            return;
        }

        if(!focusedUser) {
            return;
        }

        if(!room) {
            return;
        }

        const listener = () => {
            if(!elementRef.current) {
                return;
            }

            const position = room.roomRenderer.getItemScreenPosition(focusedUser.item);

            elementRef.current.style.left = `${position.left}px`;
            elementRef.current.style.top = `${position.top}px`;
        };

        room.roomRenderer.addEventListener("render", listener);
  
        return () => {
            room.roomRenderer.removeEventListener("render", listener);
        };
    }, [hoveredUser, room, focusedUser, elementRef.current]);


    const toggleFolded = useCallback(() => {
        setFolded(!folded);
    }, [folded]);

    return (
        <Fragment>
            <div ref={elementRef} style={{
                position: "absolute",
                whiteSpace: "nowrap"
            }}>
                {(focusedUser) && (
                    <div className="arrow" style={{
                        display: "flex",

                        width: (!folded)?(100):("max-content"),

                        transform: "translate(64px, -64px) translate(-50%, -100%)",

                        background: "#2C2B2A",
                        border: "1px solid #000000",
                        borderBottomWidth: 2,
                        borderRadius: 5,

                        pointerEvents: "auto",
                    }}>
                        <div style={{
                            flex: 1,
                            border: "1px solid #3C3C3C",
                            borderRadius: 5,
                            boxSizing: "border-box",

                            fontSize: 12,

                            flexWrap: "wrap",

                            display: "flex",
                            flexDirection: "column"
                        }}>
                            {(!folded) && (
                                <Fragment>
                                    <UserContextMenuElement position="top">
                                        {(focusedUser.type === "user")?(focusedUser.user.data.name):(focusedUser.bot.data.name)}
                                    </UserContextMenuElement>

                                    <UserContextMenuList>
                                        {(focusedUser.type === "user") && (
                                            (user?.id === focusedUser.user.data.id)?(
                                                <UserContextMenuButton text="Wardrobe" onClick={() => {
                                                    addUniqueDialog("wardrobe");
                                                    
                                                    setFolded(true);
                                                }}/>
                                            ):(
                                                <Fragment>
                                                    {(room?.information.owner.id === user?.id) && (
                                                        <UserContextMenuButton text={(focusedUser.user.data.hasRights)?("Revoke rights"):("Give rights")} onClick={() => {
                                                            webSocketClient.send<UpdateUserRightsEventData>("UpdateUserRightsEvent", {
                                                                userId: focusedUser.user.data.id,
                                                                hasRights: !focusedUser.user.data.hasRights
                                                            });
                                                        }}/>
                                                    )}

                                                    <UserContextMenuButton text="123" onClick={() => {
                                                        
                                                    }}/>
                                                </Fragment>
                                            )
                                        )}

                                        {(focusedUser.type === "bot" && focusedUser.bot.data.userId === user.id) && (
                                            <Fragment>
                                                <UserContextMenuButton text={"Pick up"} onClick={() => {
                                                    webSocketClient.send<PickupRoomBotEventData>("PickupRoomBotEvent", {
                                                        userBotId: focusedUser.bot.data.id,
                                                    });
                                                }}/>
                                            </Fragment>
                                        )}
                                    </UserContextMenuList>
                                </Fragment>
                            )}

                            <UserContextMenuElement position="bottom" hideBorder={folded} onClick={toggleFolded}>
                                <div className="sprite_context-menu_arrow-down" style={{
                                    transform: (folded)?("rotateZ(180deg)"):(undefined)
                                }}/>
                            </UserContextMenuElement>


                        </div>

                        <div className="arrow-outline"/>
                    </div>
                )}

                {(!focusedUser && hoveredUser) && (
                    <div className="arrow" style={{
                        display: "flex",

                        transform: "translate(64px, -64px) translate(-50%, -100%)",

                        background: "#2C2B2A",
                        border: "1px solid #000000",
                        borderBottomWidth: 2,
                        borderRadius: 5,
                    }}>
                        <div style={{
                            flex: 1,
                            border: "1px solid #3C3C3C",
                            borderRadius: 5,
                            boxSizing: "border-box",

                            fontSize: 12,

                            padding: "5px 12px",

                            flexWrap: "wrap",

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            {(hoveredUser.type === "user")?(hoveredUser.user.data.name):(hoveredUser.bot.data.name)}
                        </div>

                        <div className="arrow-outline"/>
                    </div>
                )}
            </div>
        </Fragment>
    );
}
