import { RoomFurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import FurnitureImage from "../../../Furniture/FurnitureImage";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import { clientInstance, webSocketClient } from "../../../../..";
import { UpdateRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UpdateRoomFurnitureEventData";
import { UseRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData";
import { PickupRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/PickupRoomFurnitureEventData";

import "./RoomFurnitureProfile.css"
import { useState } from "react";

export type RoomFurnitureProfileProps = {
    data: RoomFurnitureData;
    item: RoomFurnitureItem;
}

export default function RoomFurnitureProfile({ data, item }: RoomFurnitureProfileProps) {
    const [logic] = useState(item.furnitureRenderer.getLogic());

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

                <b>{data.furniture.name}</b>

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
                    <FurnitureImage furnitureData={data.furniture}/>
                </div>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 10
            }}>
                <div className="room-furniture-profile-button" onClick={() => {
                    clientInstance.roomInstance.value?.moveFurniture(data.id);
                }}>
                    Move
                </div>

                <div className="room-furniture-profile-button" onClick={() => {
                    webSocketClient.send<PickupRoomFurnitureEventData>("PickupRoomFurnitureEvent", {
                        roomFurnitureId: data.id,
                    });
                }}>
                    Pick up
                </div>

                {(item.furnitureRenderer.getNextDirection() !== item.furnitureRenderer.direction) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        if(item.positionPathData) {
                            return;
                        }

                        webSocketClient.send<UpdateRoomFurnitureEventData>("UpdateRoomFurnitureEvent", {
                            roomFurnitureId: data.id,
                            direction: item.furnitureRenderer.getNextDirection()
                        });
                        
                        if(item.position) {
                            item.setPositionPath(item.position, [
                                {
                                    ...item.position,
                                    depth: item.position.depth + 0.25
                                },
                                {
                                    ...item.position,
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
                        logic.use({ data, item });
                    }}>
                        Use
                    </div>
                )}
            </div>
        </div>
    );
}
