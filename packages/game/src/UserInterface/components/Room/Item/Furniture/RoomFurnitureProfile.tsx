import FurnitureImage from "../../../Furniture/FurnitureImage";
import { clientInstance, webSocketClient } from "../../../../..";
import "./RoomFurnitureProfile.css"
import { useEffect, useState } from "react";
import { useRoomInstance } from "../../../../hooks/useRoomInstance";
import { useUser } from "../../../../hooks/useUser";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { usePermissionAction } from "../../../../hooks/usePermissionAction";
import { useDialogs } from "../../../../hooks/useDialogs";
import { PickupRoomFurnitureData, UpdateRoomFurnitureData } from "@pixel63/events";

export type RoomFurnitureProfileProps = {
    furniture: RoomFurniture;
};

export default function RoomFurnitureProfile({ furniture }: RoomFurnitureProfileProps) {
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
                    <b>{furniture.data.furniture?.name}</b>

                    {(hasEditFurniturePermissions) && (
                        <div className="sprite_room_user_motto_pen" style={{
                            cursor: "pointer"
                        }} onClick={() => dialogs.addUniqueDialog("edit-furniture", furniture.data.furniture)}/>
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
                    <FurnitureImage furnitureData={furniture.data.furniture}/>
                </div>

                {(furniture.data.furniture?.description) && (
                    <div style={{
                        width: "100%",
                        height: 1,
                        background: "#333333"
                    }}/>
                )}

                {(furniture.data.furniture?.description) && (
                    <p style={{ fontSize: 12, color: "#AAA", maxWidth: 200 }}>{furniture.data.furniture.description}</p>
                )}
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
                        Move
                    </div>
                )}

                {(room?.hasRights || furniture.data.userId === user?.id) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        webSocketClient.sendProtobuff(PickupRoomFurnitureData, PickupRoomFurnitureData.create({
                            id: furniture.data.id
                        }));
                    }}>
                        Pick up
                    </div>
                )}

                {(room?.hasRights && furniture.furniture.getNextDirection() !== furniture.data.direction) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        if(furniture.item.positionPathData) {
                            return;
                        }

                        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
                            id: furniture.data.id,

                            direction: furniture.item.furnitureRenderer.getNextDirection()
                        }));
                        
                        if(furniture.item.position) {
                            furniture.item.setPositionPath(furniture.item.position, [
                                {
                                    ...furniture.item.position,
                                    depth: furniture.item.position.depth + 0.25
                                },
                                {
                                    ...furniture.item.position,
                                }
                            ],
                            100);
                        }
                    }}>
                        Rotate
                    </div>
                )}

                {(logic.isAvailable()) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        logic.use();
                    }}>
                        Use
                    </div>
                )}
            </div>
        </div>
    );
}
