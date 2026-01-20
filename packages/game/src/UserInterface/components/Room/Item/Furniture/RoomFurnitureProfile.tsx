import { RoomFurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import FurnitureImage from "../../../Furniture/FurnitureImage";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import { clientInstance, webSocketClient } from "../../../../..";
import { UpdateRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UpdateRoomFurnitureEventData";
import { PickupRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/PickupRoomFurnitureEventData";

import "./RoomFurnitureProfile.css"

export type RoomFurnitureProfileProps = {
    data: RoomFurnitureData;
    item: RoomFurnitureItem;
}

export default function RoomFurnitureProfile({ data, item }: RoomFurnitureProfileProps) {    
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
                    clientInstance.roomInstance?.moveFurniture(data.id);
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
                        webSocketClient.send<UpdateRoomFurnitureEventData>("UpdateRoomFurnitureEvent", {
                            roomFurnitureId: data.id,
                            direction: item.furnitureRenderer.getNextDirection()
                        });
                    }}>
                        Rotate
                    </div>
                )}

                {(item.furnitureRenderer.getNextAnimation() !== item.furnitureRenderer.animation) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        webSocketClient.send<UpdateRoomFurnitureEventData>("UpdateRoomFurnitureEvent", {
                            roomFurnitureId: data.id,
                            animation: item.furnitureRenderer.getNextAnimation()
                        });
                    }}>
                        Use
                    </div>
                )}
            </div>
        </div>
    );
}
