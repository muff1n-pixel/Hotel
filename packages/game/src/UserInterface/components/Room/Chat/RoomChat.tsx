import { useEffect, useRef, useState } from "react";
import RoomChatRenderer from "@Client/Room/Chat/RoomChatRenderer";
import { useRoomInstance } from "../../../hooks/useRoomInstance";
import { webSocketClient } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { RoomChatEventData } from "@Shared/Communications/Responses/Rooms/Chat/RoomChatEventData";
import OffscreenCanvasRender from "../../OffscreenCanvasRender";
import { useUser } from "../../../hooks/useUser";
import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";

type RoomChatMessage = {
    id: number;
    image: ImageBitmap;
    left: number;
    index: number;
};

function moveMessagesUp(messages: RoomChatMessage[], bottomMessage: RoomChatMessage) {
    bottomMessage.index++;

    for(const message of messages) {
        if(message.id === bottomMessage.id) {
            continue;
        }

        // message is to the left of new image
        if(message.left + message.image.width < bottomMessage.left) {
            continue;
        }

        // message is to the right of the new image
        if(message.left > bottomMessage.left + bottomMessage.image.width) {
            continue;
        }

        if(message.index !== bottomMessage.index) {
            continue;
        }

        // message is overlapping with new message
        moveMessagesUp(messages, message);
    }
}

export default function RoomChat() {
    const room = useRoomInstance();
    const user = useUser();

    const rootRef = useRef<HTMLDivElement>(null);

    const messages = useRef<RoomChatMessage[]>([]);
    const [latestMessage, setLatestMessage] = useState<number>();

    useEffect(() => {
        if(!room) {
            return;
        }

        if(!user) {
            return;
        }

        if(!messages) {
            return;
        }

        if(messages.current.length !== 0) {
            return;
        }

        (async () => {
            const roomUser = room.getUserById(user.id);

            const image = await RoomChatRenderer.render("generic", user.name, user.figureConfiguration, "Welcome to Pixel63, this is a live demo that may contain bugs and glitches.", {
                hideUsername: true,
                italic: true,
                transparent: true
            });

            const image2 = await RoomChatRenderer.render("generic", user.name, user.figureConfiguration, "Please feel free to report issues in the top left corner, or join our Discord to participate in discussions!", {
                hideUsername: true,
                italic: true,
                transparent: true
            });

            if(messages.current.length !== 0) {
                return;
            }

            const position = room.roomRenderer.getCoordinatePosition(roomUser.data.position!);

            messages.current.push({
                id: Math.random(),
                image,
                left: position.left - (image.width / 2) + 64,
                index: 1
            });

            messages.current.push({
                id: Math.random(),
                image: image2,
                left: position.left - (image2.width / 2) + 64,
                index: 0
            });

            setLatestMessage(performance.now());
        })();
    }, [room, user, messages]);

    useEffect(() => {
        if(!room) {
            return;
        }

        const listener = async (event: WebSocketEvent<RoomChatEventData>) => {
            let name: string;
            let figureConfiguration: FigureConfiguration;
            let position: RoomPosition;

            if(event.data.type === "user") {
                const user = room.getUserById(event.data.userId);

                name = user.data.name;
                figureConfiguration = user.data.figureConfiguration;

                if(!user.item.position) {
                    return;
                }
                
                position = user.item.position;
            }
            else if(event.data.type === "bot") {
                const bot = room.getBotById(event.data.botId);

                name = bot.data.name;
                figureConfiguration = bot.data.figureConfiguration;
                position = bot.data.position;
            }
            else {
                throw new Error("Unhandled room chat message type.");
            }

            const image = await RoomChatRenderer.render(event.data.roomChatStyleId, name, figureConfiguration, event.data.message, event.data.options);

            const screenPosition = room.roomRenderer.getCoordinatePosition(position);

            const left = screenPosition.left - (image.width / 2) + 64;

            const newMessage: RoomChatMessage = {
                id: Math.random(),
                image,
                left,
                index: -1
            };

            moveMessagesUp(messages.current, newMessage);

            newMessage.index = -1;

            messages.current.push(newMessage);

            setLatestMessage(performance.now());
        };

        webSocketClient.addEventListener<WebSocketEvent<RoomChatEventData>>("RoomChatEvent", listener);
        
        return () => {
            webSocketClient.removeEventListener<WebSocketEvent<RoomChatEventData>>("RoomChatEvent", listener);
        };
    }, [room]);

    useEffect(() => {
        if(!room || !rootRef.current) {
            return;
        }

        const renderListener = () => {
            if(!rootRef.current) {
                return;
            }

            rootRef.current.style.transform = `translateX(${room.roomRenderer.renderedOffset.left}px)`;
        };

        room.roomRenderer.addEventListener("render", renderListener);
        
        return () => {
            room.roomRenderer.removeEventListener("render", renderListener);
        };
    }, [room, rootRef]);

    useEffect(() => {
        const newMessage = messages.current.filter((message) => message.index === -1);

        if(newMessage.length) {
            for(const message of newMessage) {
                message.index++;
            }

            setLatestMessage(performance.now());
        }
    }, [latestMessage]);

    useEffect(() => {
        if(!messages.current.length) {
            return;
        }

        const timer = setInterval(() => {
            for(const message of messages.current) {
                message.index++;

                if(message.index > 30) {
                    messages.current.splice(messages.current.indexOf(message), 1);
                }
            }

            setLatestMessage(performance.now());
        }, 3000);
        
        return () => {
            clearInterval(timer);
        };
    }, [messages.current.length]);

    return (
        <div ref={rootRef} style={{
            position: "absolute",
            left: 0,
            top: 0,

            width: "100%",
            height: "40%"
        }}>
            {messages.current.map((message) => {
                return (
                    <div key={message.id} style={{
                        position: "absolute",
                        left: message.left,
                        bottom: message.index * 32,
                        transition: "bottom 320ms"
                    }}>
                        <OffscreenCanvasRender offscreenCanvas={message.image}/>
                    </div>
                );
            })}
        </div>
    );
}
