import RoomInstance from "@Client/Room/RoomInstance";
import { useEffect, useRef, useState } from "react";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import RoomFurnitureProfile from "./Furniture/RoomFurnitureProfile";
import RoomUserProfile from "./User/RoomUserProfile";
import { webSocketClient } from "../../../..";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import RoomBot from "@Client/Room/Bots/RoomBot";
import RoomBotProfile from "./Bot/RoomBotProfile";
import { RoomBotsData, RoomFurnitureData, RoomUserData, RoomUserLeftData } from "@pixel63/events";
import RoomItem from "@Client/Room/Items/RoomItem";

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

    /*useEffect(() => {
        if(roomEventsRegistered.current) {
            return;
        }

        return room.roomRenderer.focusedItem.subscribe((roomItem?: RoomItem | null) => {
            if(!roomItem) {
                setFocusedItem(undefined);

                return;
            }

            if(roomItem instanceof RoomFigureItem) {
                if(roomItem.type === "figure") {
                    const user = room.getUserByItem(roomItem);

                    setFocusedItem({
                        type: "user",
                        user: user.data
                    });
                }
                else if(roomItem.type === "bot") {
                    const bot = room.getBotByItem(roomItem);

                    setFocusedItem({
                        type: "bot",
                        bot: bot
                    });
                }
            }
            else if(roomItem instanceof RoomFurnitureItem) {
                const furniture = room.getFurnitureByItem(roomItem);

                setFocusedItem({
                    type: "furniture",
                    furniture
                });
            }
            else {
                setFocusedItem(undefined);
            }
        });
    }, []);*/
    
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
            const listener = webSocketClient.addProtobuffListener(RoomUserLeftData, {
                async handle(payload: RoomUserLeftData) {
                    if(payload.userId === focusedItem.user.id) {
                        setFocusedItem(undefined);
                    }
                },
            });

            return () => {
                webSocketClient.removeProtobuffListener(RoomUserLeftData, listener);
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
