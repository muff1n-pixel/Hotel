import DialogButton from "../../Dialog/Button/DialogButton";
import { useCallback, useEffect, useRef, useState } from "react";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { webSocketClient } from "../../../..";
import InventoryEmptyTab from "./InventoryEmptyTab";
import { UserBadgeData } from "@Shared/Interfaces/User/UserBadgeData";
import { InventoryBadgesEventData } from "@Shared/Communications/Responses/Inventory/UserBadgesEventData";
import { UpdateUserBadgeEventData } from "@Shared/Communications/Requests/Inventory/Badges/UpdateUserBadgeEventData";
import BadgeImage from "../../Badges/BadgeImage";

export default function InventoryBadgesTab() {
    const [activeBadge, setActiveBadge] = useState<UserBadgeData>();
    const [userBadges, setUserBadges] = useState<UserBadgeData[]>([]);

    const userBadgesRequested = useRef<boolean>(false);

    useEffect(() => {
        if(userBadgesRequested.current) {
            return;
        }

        userBadgesRequested.current = true;

        webSocketClient.send("GetInventoryBadgesEvent", null);
    }, []);

    useEffect(() => {
        const listener = (event: WebSocketEvent<InventoryBadgesEventData>) => {
            setUserBadges(event.data.badges);
        }

        webSocketClient.addEventListener<WebSocketEvent<InventoryBadgesEventData>>("InventoryBadgesEvent", listener);

        return () => {
            webSocketClient.removeEventListener<WebSocketEvent<InventoryBadgesEventData>>("InventoryBadgesEvent", listener);
        };
    }, []);

    useEffect(() => {
        if(!activeBadge && userBadges.length) {
            setActiveBadge(userBadges[0]);
        }
        else if(activeBadge && !userBadges.includes(activeBadge)) {
            setActiveBadge(userBadges[0] ?? undefined);
        }
        else if(activeBadge) {
            const active = userBadges.find((userBadge) => userBadge.id === activeBadge.id);

            setActiveBadge(active);
        }
    }, [activeBadge, userBadges]);

    const handleToggleEquip = useCallback(() => {
        if(!activeBadge) {
            return;
        }

        webSocketClient.send<UpdateUserBadgeEventData>("UpdateUserBadgeEvent", {
            badgeId: activeBadge.id,
            equipped: !activeBadge.equipped
        });
    }, [activeBadge]);

    if(!userBadges.length) {
        return (<InventoryEmptyTab/>);
    }

    return (
        <div style={{
            flex: "1 1 0",

            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{
                flex: 1,

                display: "flex",
                flexDirection: "row",
                gap: 20
            }}>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignContent: "start",
                    gap: 4,

                    overflowY: "scroll"
                }}>
                    {userBadges?.filter((userBadge) => !userBadge.equipped).map((userBadge) => (
                        <div key={userBadge.id} style={{
                            display: "flex",

                            width: 44,
                            height: 44,


                            border: "1px solid black",
                            borderRadius: 6,

                            cursor: "pointer",

                            position: "relative"
                        }} onClick={() => setActiveBadge(userBadge)}>
                            <div style={{
                                flex: 1,

                                border: (activeBadge?.id === userBadge.id)?("2px solid white"):("2px solid transparent"),
                                borderRadius: 6,

                                boxSizing: "border-box",

                                background: "#CBCBCB",

                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <BadgeImage badge={userBadge.badge}/>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    width: 44 + 44 + 8,

                    padding: "0 10px",

                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                    gap: 4
                }}>
                    {userBadges?.filter((userBadge) => userBadge.equipped).toReversed().map((userBadge) => (
                        <div key={userBadge.id} style={{
                            display: "flex",

                            width: 44,
                            height: 44,


                            border: "1px solid black",
                            borderRadius: 6,

                            cursor: "pointer",

                            position: "relative"
                        }} onClick={() => setActiveBadge(userBadge)}>
                            <div style={{
                                flex: 1,

                                border: (activeBadge?.id === userBadge.id)?("2px solid white"):("2px solid transparent"),
                                borderRadius: 6,

                                boxSizing: "border-box",

                                background: "#CBCBCB",

                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <BadgeImage badge={userBadge.badge}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {(activeBadge) && (
                <div style={{
                    background: "#FFF",
                    borderRadius: 6,
                    padding: 6
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 16,

                        alignItems: "center"
                    }}>
                        <div style={{
                            width: 40,
                            height: 40
                        }}>
                            <BadgeImage badge={activeBadge.badge}/>
                        </div>

                        <div style={{ flex: 1, alignSelf: "flex-start" }}>
                            <b>{activeBadge.badge.name}</b>
                            <p>{activeBadge.badge.description}</p>
                        </div>

                        <div style={{
                        }}>
                            <DialogButton onClick={handleToggleEquip} disabled={(!activeBadge.equipped && userBadges.filter((userBadge) => userBadge.equipped).length === 6)}>
                                {(activeBadge.equipped)?("Clear badge"):("Wear badge")}
                            </DialogButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
