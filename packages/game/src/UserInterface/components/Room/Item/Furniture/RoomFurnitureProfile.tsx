import FurnitureImage from "../../../Furniture/FurnitureImage";
import { clientInstance, webSocketClient } from "../../../../..";
import { UpdateRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UpdateRoomFurnitureEventData";
import { PickupRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/PickupRoomFurnitureEventData";

import "./RoomFurnitureProfile.css"
import { useState } from "react";
import { useRoomInstance } from "../../../../hooks/useRoomInstance";
import { useUser } from "../../../../hooks/useUser";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";

export type RoomFurnitureProfileProps = {
    furniture: RoomFurniture;
};

export default function RoomFurnitureProfile({ furniture }: RoomFurnitureProfileProps) {
    const user = useUser();

    const room = useRoomInstance();

    const [logic] = useState(furniture.getLogic());

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
                gap: 10
            }}>

                <b>{furniture.data.furniture.name}</b>

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

                {(furniture.data.furniture.description) && (
                    <div style={{
                        width: "100%",
                        height: 1,
                        background: "#333333"
                    }}/>
                )}

                {(furniture.data.furniture.description) && (
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
                        clientInstance.roomInstance.value?.moveFurniture(furniture.data.furniture.id);
                    }}>
                        Move
                    </div>
                )}

                {(room?.hasRights || furniture.data.userId === user?.id) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        webSocketClient.send<PickupRoomFurnitureEventData>("PickupRoomFurnitureEvent", {
                            roomFurnitureId: furniture.data.id,
                        });
                    }}>
                        Pick up
                    </div>
                )}

                {(room?.hasRights && furniture.furniture.getNextDirection() !== furniture.data.direction) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        if(furniture.item.positionPathData) {
                            return;
                        }

                        webSocketClient.send<UpdateRoomFurnitureEventData>("UpdateRoomFurnitureEvent", {
                            roomFurnitureId: furniture.data.id,
                            direction: furniture.item.furnitureRenderer.getNextDirection()
                        });
                        
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
                        logic.use(furniture);
                    }}>
                        Use
                    </div>
                )}
            </div>
        </div>
    );
}
