import RoomInstance from "@Client/Room/RoomInstance";
import { useEffect, useRef, useState } from "react";
import { RoomUserData } from "@Shared/Interfaces/Room/RoomUserData";
import { RoomFurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import RoomFurnitureProfile from "./Furniture/RoomFurnitureProfile";
import RoomUserProfile from "./User/RoomUserProfile";
import RoomItem from "@Client/Room/Items/RoomItem";
import { webSocketClient } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import RoomFurnitureEvent from "@Client/Communications/Room/Furniture/RoomFurnitureEvent";
import { RoomFurnitureEventData } from "@Shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData";
import { UserLeftRoomEventData } from "@Shared/Communications/Responses/Rooms/Users/UserLeftRoomEventData";

export type RoomItemProfileItem = {
    type: "user";
    user: RoomUserData;
} | {
    type: "furniture";
    data: RoomFurnitureData;
    item: RoomFurnitureItem;
};

export type RoomItemProfileProps = {
    room: RoomInstance;
};

export default function RoomItemProfile({ room }: RoomItemProfileProps) {
    const roomEventsRegistered = useRef<boolean>(false);

    const [focusedItem, setFocusedItem] = useState<RoomItemProfileItem>();

    useEffect(() => {
        if(roomEventsRegistered.current) {
            return;
        }

        room.roomRenderer.cursor?.addEventListener("click", (event) => {
            if(!(event instanceof RoomClickEvent)) {
                return;
            }

            if(event.otherEntity) {
                if(event.otherEntity.item instanceof RoomFigureItem) {
                    const user = room.getUserByItem(event.otherEntity.item);

                    setFocusedItem({
                        type: "user",
                        user: user.data
                    });
                }
                else if(event.otherEntity.item instanceof RoomFurnitureItem) {
                    const furniture = room.getFurnitureByItem(event.otherEntity.item);

                    setFocusedItem({
                        type: "furniture",
                        ...furniture
                    });
                }
                else {
                    setFocusedItem(undefined);
                }
            }
            else {
                setFocusedItem(undefined);
            }
        });
    }, []);
    
    useEffect(() => {
        if(!focusedItem) {
            return;
        }

        if(focusedItem.type === "furniture") {
            const listener = (event: WebSocketEvent<RoomFurnitureEventData>) => {
                if(event.data.furnitureRemoved?.some((removedFurniture) => removedFurniture.id === focusedItem.data.id)) {
                    setFocusedItem(undefined);
                }
            };

            webSocketClient.addEventListener<WebSocketEvent<RoomFurnitureEventData>>("RoomFurnitureEvent", listener);

            return () => {
                webSocketClient.removeEventListener<WebSocketEvent<RoomFurnitureEventData>>("RoomFurnitureEvent", listener);
            };
        }
        else if(focusedItem.type === "user") {
            const listener = (event: WebSocketEvent<UserLeftRoomEventData>) => {
                if(event.data.userId === focusedItem.user.id) {
                    setFocusedItem(undefined);
                }
            };

            webSocketClient.addEventListener<WebSocketEvent<UserLeftRoomEventData>>("UserLeftRoomEvent", listener);

            return () => {
                webSocketClient.removeEventListener<WebSocketEvent<UserLeftRoomEventData>>("UserLeftRoomEvent", listener);
            };
        }
    }, [focusedItem]);

    if(!focusedItem) {
        return null;
    }

    return (
        <div style={{
            position: "absolute",

            padding: 10,

            right: 0,
            bottom: 50,
        }}>
            {(focusedItem.type === "furniture")?(
                <RoomFurnitureProfile data={focusedItem.data} item={focusedItem.item}/>
            ):(
                <RoomUserProfile user={focusedItem.user}/>
            )}
        </div>
    );
}
