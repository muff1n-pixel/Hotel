import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { webSocketClient } from "../../../..";
import InventoryEmptyTab from "./InventoryEmptyTab";
import BadgeImage from "../../../Common/Badges/BadgeImage";
import { GetUserInventoryBadgesData, UpdateUserBadgeData, UserBadgeData, UserInventoryBadgesData } from "@pixel63/events";
import DialogScrollArea from "../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import { useUserBadgeNotifications } from "@UserInterface/Hooks/User/Notifications/useUserBadgeNotifications";

export default function InventoryBadgesTab() {
    const userBadgeNotifications = useUserBadgeNotifications();

    const [activeBadge, setActiveBadge] = useState<UserBadgeData>();
    const [userBadges, setUserBadges] = useState<UserInventoryBadgesData["badges"]>([]);
    const [achievementScore, setAchievementScore] = useState<number>(0);

    const userBadgesRequested = useRef<boolean>(false);

    useEffect(() => {
        if(!activeBadge) {
            return;
        }

        if(userBadgeNotifications.hasUserBadgeNotification(activeBadge.id)) {
            userBadgeNotifications.removeUserBadgeNotification(activeBadge.id);
        }
    }, [activeBadge, userBadgeNotifications]);

    useEffect(() => {
        if(userBadgesRequested.current) {
            return;
        }

        userBadgesRequested.current = true;

        webSocketClient.sendProtobuff(GetUserInventoryBadgesData, GetUserInventoryBadgesData.create({}));
    }, []);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserInventoryBadgesData, {
            async handle(payload: UserInventoryBadgesData) {
                setUserBadges(payload.badges);
                setAchievementScore(payload.achievementScore);
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

    const filteredUnequippedBadges = useMemo(() => {
        return userBadges?.filter((userBadge) => !userBadge.equipped).map((userBadge) => {
            const notification = userBadgeNotifications.hasUserBadgeNotification(userBadge.id);
            
            return (
                <div key={userBadge.id} style={{
                    display: "flex",

                    width: 46,
                    height: 46,


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

                        ...(notification && {
                            background: "#9BCA64"
                        }),

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <BadgeImage badge={userBadge.badge}/>
                    </div>
                </div>
            );
        });
    }, [userBadges, activeBadge, userBadgeNotifications]);

    if(!userBadges.length) {
        return (<InventoryEmptyTab/>);
    }

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",
            gap: 5
        }}>
            <div style={{
                flex: "1 1 0",

                display: "flex",
                flexDirection: "row",
                gap: 20,

                overflow: "hidden"
            }}>
                <DialogScrollArea hideInactive>
                    <div style={{
                        flex: 1,

                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignContent: "start",
                        gap: 4,

                        overflowY: "scroll"
                    }}>
                        {filteredUnequippedBadges}
                    </div>
                </DialogScrollArea>

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

            <div style={{
                background: "#1C8BB5",
                borderRadius: 6,
                textAlign: "center",
                color: "#FFFFFF",
                padding: 2
            }}>
                <b>Achievement score: {achievementScore.toLocaleString('en-US')}</b>
            </div>
        </div>
    );
}
