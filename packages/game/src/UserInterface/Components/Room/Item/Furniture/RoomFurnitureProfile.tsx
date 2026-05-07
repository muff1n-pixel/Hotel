import FurnitureImage from "../../../Furniture/FurnitureImage";
import { clientInstance, webSocketClient } from "../../../../..";
import "./RoomFurnitureProfile.css"
import { useEffect, useState } from "react";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import { useUser } from "../../../../Hooks/useUser";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { usePermissionAction } from "../../../../Hooks/usePermissionAction";
import { useDialogs } from "../../../../Hooks/useDialogs";
import { PickupRoomFurnitureData, UpdateRoomFurnitureData } from "@pixel63/events";
import FurnitureShopLink from "@UserInterface/Components/Furniture/FurnitureShopLink";
import UserLink from "@UserInterface/Common/Users/UserLink";
import { useTranslation } from "react-i18next";

export type RoomFurnitureProfileProps = {
    furniture: RoomFurniture;
};

export default function RoomFurnitureProfile({ furniture }: RoomFurnitureProfileProps) {
    const [getTranslation] = useTranslation("room");

    const user = useUser();
    const dialogs = useDialogs();

    const hasEditFurniturePermissions = usePermissionAction("furniture:edit");

    const room = useRoomInstance();

    const [logic, setLogic] = useState(furniture.getLogic());

    useEffect(() => {
        setLogic(furniture.getLogic());
    }, [furniture]);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 10
        }}>
            <div style={{
                background: "rgba(61, 61, 61, .95)",
                padding: 10,
                borderRadius: 6,
                fontSize: 11,

                minWidth: 170,

                display: "flex",
                flexDirection: "column",
                gap: 10,

                pointerEvents: "auto"
            }}>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,

                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <b>{furniture.data.name ?? furniture.furnitureData.name}</b>

                    {(hasEditFurniturePermissions) && (
                        <div className="sprite_room_user_motto_pen" style={{
                            cursor: "pointer"
                        }} onClick={() => dialogs.addUniqueDialog("edit-furniture", furniture.furnitureData)}/>
                    )}
                </div>

                <div style={{
                    width: "100%",
                    height: 1,
                    background: "#333333"
                }}/>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <FurnitureImage furnitureData={furniture.furnitureData} externalImage={furniture.data.data?.externalImage?.externalImage}/>
                </div>

                {(furniture.data.description ?? furniture.furnitureData.description) && (
                    <div style={{
                        width: "100%",
                        height: 1,
                        background: "#333333"
                    }}/>
                )}

                {(furniture.furnitureData.description) && (
                    <p style={{ fontSize: 12, color: "#AAA", maxWidth: 200 }}>{furniture.data.description ?? furniture.furnitureData.description}</p>
                )}

                {(furniture.data.user) && (
                    <UserLink id={furniture.data.user.id} name={furniture.data.user.name} reversed/>
                )}

                <FurnitureShopLink furniture={furniture.furnitureData}/>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 10
            }}>
                {(room?.hasRights) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        clientInstance.roomInstance.value?.moveFurniture(furniture.data.id);
                    }}>
                        {getTranslation("item.profile.move")}
                    </div>
                )}

                {(furniture.data.userId && (room?.hasRights || furniture.data.userId === user?.id)) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        webSocketClient.sendProtobuff(PickupRoomFurnitureData, PickupRoomFurnitureData.create({
                            id: furniture.data.id
                        }));
                    }}>
                        {getTranslation("item.profile.pick_up")}
                    </div>
                )}

                {(furniture.data.userId && (room?.hasRights && furniture.furniture.getNextDirection() !== furniture.data.direction)) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        if(furniture.item.positionPathData) {
                            return;
                        }

                        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
                            id: furniture.data.id,

                            direction: furniture.item.furnitureRenderer.getNextDirection()
                        }));
                    }}>
                        {getTranslation("item.profile.rotate")}
                    </div>
                )}

                {(logic.isAvailable()) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        logic.use();
                    }}>
                        {getTranslation("item.profile.use")}
                    </div>
                )}
            </div>
        </div>
    );
}
