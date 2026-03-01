import DialogButton from "../../Dialog/Button/DialogButton";
import { useCallback, useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../..";
import InventoryEmptyTab from "./InventoryEmptyTab";
import BadgeImage from "../../Badges/BadgeImage";
import { UpdateUserBadgeData, UserBadgeData, UserInventoryBadgesData } from "@pixel63/events";

export default function InventoryBadgesTab() {
    const [activeBadge, setActiveBadge] = useState<UserBadgeData>();
    const [userBadges, setUserBadges] = useState<UserInventoryBadgesData["badges"]>([]);

    const userBadgesRequested = useRef<boolean>(false);

    useEffect(() => {
        if(userBadgesRequested.current) {
            return;
        }

        userBadgesRequested.current = true;

        webSocketClient.send("GetInventoryBadgesEvent", null);
    }, []);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserInventoryBadgesData, {
            async handle(payload: UserInventoryBadgesData) {
                setUserBadges(payload.badges);
            },
        });

        return () => {
            webSocketClient.removeProtobuffListener(UserInventoryBadgesData, listener);
        };
    }, []);

    useEffect(() => {
        if(!activeBadge && userBadges[0]) {
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

        webSocketClient.sendProtobuff(UpdateUserBadgeData, UpdateUserBadgeData.create({
            badgeId: activeBadge.id,
            equipped: !activeBadge.equipped
        }));
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
                            <b>{activeBadge.badge?.name}</b>
                            <p>{activeBadge.badge?.description}</p>
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
