import { useUserBadges } from "../../../../Hooks/useUserBadges";
import BadgeImage from "../../../../Common/Badges/BadgeImage";
import { useUser } from "../../../../Hooks/useUser";
import { useCallback, useMemo } from "react";
import "./RoomUserProfile.css";
import { webSocketClient } from "../../../../..";
import RoomUserProfileMotto from "./RoomUserProfileMotto";
import { RoomUserData, SetUserMottoData } from "@pixel63/events";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";
import UserLink from "@UserInterface/Common/Users/UserLink";
import { useTranslation } from "react-i18next";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useUserFriendRelationships } from "@UserInterface/Hooks/useUserFriendRelationships";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type RoomUserProfileProps = {
    user: RoomUserData;
}

export default function RoomUserProfile({ user: targetUser }: RoomUserProfileProps) {
    const room = useRoomInstance();
    const dialogs = useDialogs();
    const user = useUser();
    
    const [getCarryItemTranslation] = useTranslation("carryitems");

    const carryItemId = useMemo(() => {
        const roomUser = room?.users.find((roomUser) => roomUser.data.id === user.id);

        if(!roomUser) {
            return null;
        }

        const carryItemAction = roomUser.item.figureRenderer.actions.find((action) => action.startsWith("CarryItem"));

        if(!carryItemAction) {
            return null;
        }

        const carryItemId = carryItemAction.split('.')[1];

        if(carryItemId === undefined) {
            return null;
        }

        return carryItemId;
    }, [user, room]);

    const badges = useUserBadges(targetUser.id);
    const relationships = useUserFriendRelationships(targetUser.id);

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
            <b><UserLink id={targetUser.id} name={targetUser.name!} reversed/></b>

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

                    pointerEvents: "none"
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
                            <BadgeImage key={badge.id} badge={badge}/>
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

            {(relationships && relationships.loveRelationships.length > 0) && (
                <FlexLayout align="center" gap={5} direction="row">
                    <div className="sprite_users_relationships_heart"/>

                    <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => dialogs.addUniqueDialog("user-profile", relationships.loveRelationships[0].userId, relationships.loveRelationships[0].userId)}>
                        {(relationships.loveRelationships.length === 1)?(
                            relationships.loveRelationships[0].name
                        ):(
                            relationships.loveRelationships[0].name + " and " + (relationships.loveRelationships.length - 1) + "others"
                        )}
                    </div>
                </FlexLayout>
            )}

            {(relationships && relationships.smileRelationships.length > 0) && (
                <FlexLayout align="center" gap={5} direction="row">
                    <div className="sprite_users_relationships_smile"/>

                    <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => dialogs.addUniqueDialog("user-profile", relationships.smileRelationships[0].userId, relationships.smileRelationships[0].userId)}>
                        {(relationships.smileRelationships.length === 1)?(
                            relationships.smileRelationships[0].name
                        ):(
                            relationships.smileRelationships[0].name + " and " + (relationships.smileRelationships.length - 1) + "others"
                        )}
                    </div>
                </FlexLayout>
            )}

            {(relationships && relationships.bobbaRelationships.length > 0) && (
                <FlexLayout align="center" gap={5} direction="row">
                    <div className="sprite_users_relationships_bobba"/>

                    <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => dialogs.addUniqueDialog("user-profile", relationships.bobbaRelationships[0].userId, relationships.bobbaRelationships[0].userId)}>
                        {(relationships.bobbaRelationships.length === 1)?(
                            relationships.bobbaRelationships[0].name
                        ):(
                            relationships.bobbaRelationships[0].name + " and " + (relationships.bobbaRelationships.length - 1) + "others"
                        )}
                    </div>
                </FlexLayout>
            )}

            {(carryItemId) && (
                <div style={{
                    width: "100%",
                    height: 1,
                    background: "#333333"
                }}/>
            )}

            {(carryItemId) && (
                <div>Carrying: {getCarryItemTranslation(`handitem_${carryItemId}`)}</div>
            )}
        </div>
    );
}
