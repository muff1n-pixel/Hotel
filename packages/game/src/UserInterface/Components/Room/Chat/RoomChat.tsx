import { useCallback, useEffect, useRef, useState } from "react";
import RoomChatRenderer from "@Client/Room/Chat/RoomChatRenderer";
import { useRoomInstance } from "../../../Hooks2/useRoomInstance";
import { webSocketClient } from "../../../..";
import OffscreenCanvasRender from "../../../Common/OffscreenCanvas/OffscreenCanvasRender";
import { useUser } from "../../../Hooks2/useUser";
import { RoomActorChatData } from "@pixel63/events";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";

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
    const user = useUser();

    const rootRef = useRef<HTMLDivElement>(null);

    const messages = useRef<RoomChatMessage[]>([]);
    const [latestMessage, setLatestMessage] = useState<number>();

    useEffect(() => {
        if(!room) {
            return;
        }

        if(!messages) {
            return;
        }

        if(messages.current.length !== 0) {
            return;
        }

        (async () => {
            if(!user.figureConfiguration) {
                return;
            }

            const roomUser = room.getUserById(user.id);

            const image = await RoomChatRenderer.render("generic", user.name, user.figureConfiguration, "Welcome to Pixel63, this is a live demo that may contain bugs and glitches.", {
                $type: "RoomActorChatOptionsData",
                hideUsername: true,
                italic: true,
                transparent: true
            });

            const image2 = await RoomChatRenderer.render("generic", user.name, user.figureConfiguration, "Please feel free to report issues in the top left corner, or join our Discord to participate in discussions!", {
                $type: "RoomActorChatOptionsData",
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

        const listener = webSocketClient.addProtobuffListener(RoomActorChatData, {
            async handle(payload: RoomActorChatData) {

                const actor = room.getActor(payload.actor);

                if(!(actor.item instanceof RoomFigureItem)) {
                    return;
                }

                const name = actor.data.name;
                const figureConfiguration = (actor.data as any).figureConfiguration;

                if(!actor.item.position || !figureConfiguration) {
                    return;
                }
                
                const position = actor.item.position;

                const image = await RoomChatRenderer.render(payload.roomChatStyleId, name, figureConfiguration, payload.message, payload.options);

                const screenPosition = room.roomRenderer.getCoordinatePosition(position);

                const left = screenPosition.left - (image.width / 2) + 64;

                const newMessage: RoomChatMessage = {
                    id: Math.random(),
                    image,
                    left,
                    index: -1,
                    userId: payload.actor?.user?.userId
                };

                moveMessagesUp(messages.current, newMessage);

                if(newMessage.index === 0) {
                    newMessage.index = -1;
                }

                messages.current.push(newMessage);

                setLatestMessage(performance.now());
            },
        })

        return () => {
            webSocketClient.removeProtobuffListener(RoomActorChatData, listener);
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
            }

            messages.current = messages.current.filter((message) => message.index < 30);

            setLatestMessage(performance.now());
        }, 3000);
        
        return () => {
            clearInterval(timer);
        };
    }, [messages.current.length]);

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
                        pointerEvents: (message.userId)?("auto"):("none")
                    }} onClick={() => onClickUserMessage(message)}>
                        <OffscreenCanvasRender offscreenCanvas={message.image}/>
                    </div>
                );
            })}
        </div>
    );
}
