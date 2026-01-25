import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../contexts/AppContext";
import RoomChatRenderer from "@Client/Room/Chat/RoomChatRenderer";
import { useRoomInstance } from "../../../hooks/useRoomInstance";
import { webSocketClient } from "../../../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { UserChatEventData } from "@Shared/Communications/Responses/Rooms/Users/UserChatEventData";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import OffscreenCanvasRender from "../../OffscreenCanvasRender";
import RoomRenderEvent from "@Client/Events/RoomRenderEvent";

type RoomChatMessage = {
    id: number;
    image: ImageBitmap;
    left: number;
    index: number;
};

function moveMessagesUp(messages: RoomChatMessage[], bottomMessage: RoomChatMessage) {
    bottomMessage.index++;

    for(let message of messages) {
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

    const rootRef = useRef<HTMLDivElement>(null);

    const messages = useRef<RoomChatMessage[]>([]);
    const [latestMessage, setLatestMessage] = useState<number>();

    useEffect(() => {
        if(!room) {
            return;
        }

        const userChatEventListener = async (event: WebSocketEvent<UserChatEventData>) => {
            const user = room.getUserById(event.data.userId);

            const image = await RoomChatRenderer.render("storm", user.data.name, user.data.figureConfiguration, event.data.message);

            const position = room.roomRenderer.getCoordinatePosition(user.item.position!);

            const left = position.left - (image.width / 2) + 64;

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

        webSocketClient.addEventListener<WebSocketEvent<UserChatEventData>>("UserChatEvent", userChatEventListener);
        
        return () => {
            webSocketClient.removeEventListener<WebSocketEvent<UserChatEventData>>("UserChatEvent", userChatEventListener);
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
            for(let message of newMessage) {
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
            for(let message of messages.current) {
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
