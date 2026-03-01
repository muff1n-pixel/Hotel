import RoomInstance from "@Client/Room/RoomInstance";
import { useEffect, useRef, useState } from "react";
import { RoomUserData } from "@Shared/Interfaces/Room/RoomUserData";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import RoomFurnitureProfile from "./Furniture/RoomFurnitureProfile";
import RoomUserProfile from "./User/RoomUserProfile";
import { webSocketClient } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { UserLeftRoomEventData } from "@Shared/Communications/Responses/Rooms/Users/UserLeftRoomEventData";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import RoomBot from "@Client/Room/Bots/RoomBot";
import RoomBotProfile from "./Bot/RoomBotProfile";
import { RoomBotsData, RoomFurnitureData } from "@pixel63/events";

export type RoomItemProfileItem = {
    type: "user";
    user: Required<RoomUserData>;
} | {
    type: "furniture";
    furniture: RoomFurniture;
} | {
    type: "bot";
    bot: RoomBot;
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
                    if(event.otherEntity.item.type === "figure") {
                        const user = room.getUserByItem(event.otherEntity.item);

                        setFocusedItem({
                            type: "user",
                            user: user.data
                        });
                    }
                    else if(event.otherEntity.item.type === "bot") {
                        const bot = room.getBotByItem(event.otherEntity.item);

                        setFocusedItem({
                            type: "bot",
                            bot: bot
                        });
                    }
                }
                else if(event.otherEntity.item instanceof RoomFurnitureItem) {
                    const furniture = room.getFurnitureByItem(event.otherEntity.item);

                    setFocusedItem({
                        type: "furniture",
                        furniture
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
            const listener = webSocketClient.addProtobuffListener(RoomFurnitureData, {
                async handle(payload: RoomFurnitureData) {
                    if(payload.furnitureRemoved?.some((removedFurniture) => removedFurniture.id === focusedItem.furniture.data.id)) {
                        setFocusedItem(undefined);
                    }
                },
            });

            return () => {
                webSocketClient.removeProtobuffListener(RoomFurnitureData, listener);
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
        else if(focusedItem.type === "bot") {
            const listener = webSocketClient.addProtobuffListener(RoomBotsData, {
                async handle(payload: RoomBotsData) {
                    if(payload.botsRemoved?.some((removedBot) => removedBot.id === focusedItem.bot.data.id)) {
                        setFocusedItem(undefined);
                    }
                },
            })

            return () => {
                webSocketClient.removeProtobuffListener(RoomBotsData, listener);
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
            {(() => {
                switch(focusedItem.type) {
                    case "furniture":
                        return (<RoomFurnitureProfile furniture={focusedItem.furniture}/>);

                    case "user":
                        return (<RoomUserProfile user={focusedItem.user}/>);

                    case "bot":
                        return (<RoomBotProfile bot={focusedItem.bot}/>);
                }
            })()}
        </div>
    );
}
