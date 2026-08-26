import { useCallback, useEffect, useRef, useState } from "react";
import RoomChatRenderer from "@Client/Room/Chat/RoomChatRenderer";
import { useRoomInstance } from "../../../Hooks/useRoomInstance";
import { webSocketClient } from "../../../..";
import OffscreenCanvasRender from "../../../Common/OffscreenCanvas/OffscreenCanvasRender";
import { RoomActorChatData } from "@pixel63/events";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import { useTranslation } from "react-i18next";

import "./RoomChat.css";
import RoomRenderer from "@Client/Room/Renderer/RoomRenderer";
import RoomCoordinateMapper from "@Client/Room/Renderer/RoomCoordinateMapper";

type RoomChatMessage = {
    id: number;
    image: ImageBitmap;
    left: number;
    index: number;
    userId?: string;
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

    const rootRef = useRef<HTMLDivElement>(null);

    const messages = useRef<RoomChatMessage[]>([]);
    const [latestMessage, setLatestMessage] = useState<number>();

    const [getVocalTranslation] = useTranslation("vocals");

    useEffect(() => {
        if(!room) {
            return;
        }

        const listener = room.websocket.addProtobuffListener(RoomActorChatData, {
            async handle(payload: RoomActorChatData) {

                const actor = room.getActor(payload.actor);

                const name = actor.data.name;

                if(!actor.item.position) {
                    return;
                }
                
                let message: string = payload.message;

                if(payload.messageVocals.length) {
                    if(payload.messageVocalIndex !== undefined) {
                        const texts = getVocalTranslation(payload.messageVocals, {
                            returnObjects: true
                        }) as string[];

                        message = texts[payload.messageVocalIndex % texts.length];
                    }
                    else {
                        message = getVocalTranslation(payload.messageVocals);
                    }
                }

                const image = await RoomChatRenderer.render(payload.roomChatStyleId, name, actor, message, payload.options);

                const screenPosition = RoomCoordinateMapper.getCoordinatePosition(actor.item.position, room.roomRenderer.container.scale.x);

                const left = screenPosition.left - (image.width / 2) + (64 * room.roomRenderer.container.scale.x);

                const newMessage: RoomChatMessage = {
                    id: Math.random(),
                    image,
                    left,
                    index: -1,
                    userId: payload.actor?.user?.userId
                };

                moveMessagesUp(messages.current, newMessage);

                messages.current.push(newMessage);

                setLatestMessage(performance.now());
            },
        })

        return () => {
            room.websocket.removeProtobuffListener(RoomActorChatData, listener);
        };
    }, [room, getVocalTranslation]);

    useEffect(() => {
        if(!room || !rootRef.current) {
            return;
        }

        const renderListener = () => {
            if(!rootRef.current) {
                return;
            }

            rootRef.current.style.transform = `translateX(${room.roomRenderer.camera.cameraPosition.left}px)`;
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
        const timer = setInterval(() => {
            for(const message of messages.current) {
                message.index++;
            }

            messages.current = messages.current.filter((message) => message.index < 30);

            setLatestMessage(performance.now());
        }, 3000);
        
        return () => {
            clearInterval(timer);
        };
    }, [latestMessage]);

    const onClickUserMessage = useCallback((message: RoomChatMessage) => {
        if(!room) {
            return;
        }

        if(!message.userId) {
            return;
        }

        const roomUser = room.users.find((user) => user.data.id === message.userId);

        if(roomUser) {
            room.roomRenderer.focusedItem.value = roomUser.item;
        }
    }, [room]);

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
                        transition: "bottom 320ms",
                        cursor: (message.userId)?("pointer"):("default"),
                        pointerEvents: (message.userId)?("auto"):("none"),
                        animation: "roomChatMessageSlideIn 320ms ease-out"
                    }} onClick={() => onClickUserMessage(message)}>
                        <OffscreenCanvasRender offscreenCanvas={message.image}/>
                    </div>
                );
            })}
        </div>
    );
}
