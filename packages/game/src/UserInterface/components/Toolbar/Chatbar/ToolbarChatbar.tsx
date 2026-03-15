import { useCallback, useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../..";
import ToolbarChatbarStyles from "./ToolbarChatbarStyles";
import { useDialogs } from "../../../hooks/useDialogs";
import { SendRoomChatMessageData, SetRoomChatTypingData } from "@pixel63/events";

export default function ToolbarChatbar() {
    const dialogs = useDialogs();

    const inputRef = useRef<HTMLDivElement>(null);
    const shiftPressed = useRef<boolean>(false);
    const altPressed = useRef<boolean>(false);
    const [value, setValue] = useState("");
    const [roomChatStyles, setRoomChatStyles] = useState(false);
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        if (value.length && !typing) {
            setTyping(true);

            return;
        }

        if (!value.length && typing) {
            setTyping(false);
        }
    }, [value, typing]);

    useEffect(() => {
        webSocketClient.sendProtobuff(SetRoomChatTypingData, SetRoomChatTypingData.create({
            typing: (value.length) ? (true) : (false)
        }));
    }, [typing]);

    const handleSubmit = useCallback(() => {
        if (!value.length) {
            return;
        }

        setTyping(false);

        if (value[0] === ':' || value[0] === '/') {
            const input = value.split(' ');

            const command = input[0].substring(1);

            switch (command) {
                case "commands": {
                    dialogs.addUniqueDialog("room-chat-commands");

                    return;
                }

                case "furni": {
                    dialogs.addUniqueDialog("room-furni");

                    return;
                }

                case "enable": {
                    if (input.length === 1) {
                        dialogs.addUniqueDialog("figure-catalog");

                        return;
                    }

                    break;
                }

                case "carry": {
                    if (input.length === 1) {
                        dialogs.addUniqueDialog("figure-catalog");

                        return;
                    }

                    break;
                }

                case "figure": {
                    dialogs.addUniqueDialog("figure");

                    return;
                }

                case "floor": {
                    dialogs.addUniqueDialog("room-floorplan");

                    return;
                }
            }
        }

        webSocketClient.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
            message: value,
            cry: shiftPressed.current ? true : false
        }));
    }, [dialogs, value, shiftPressed]);

    const handleKeyUp = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (!inputRef.current)
                return;

            if (event.key === "Enter") {
                handleSubmit();
                setValue("")
                inputRef.current.textContent = "";
                return;
            }

            if(event.key === "Shift") {
                shiftPressed.current = false;
            }

            // TODO ---> ADDING ALT ICONS
            if(event.key === "Alt") {
                altPressed.current = false;
            }

            setValue(inputRef.current.textContent);
        },
        [handleSubmit, shiftPressed, altPressed, setValue]
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter") {
                event.preventDefault()
                return;
            }

            if(event.key === "Shift") {
                shiftPressed.current = true;
            }

            if(event.key === "Alt") {
                altPressed.current = true;
            }
        },
        [shiftPressed, altPressed]
    );

    return (
        <div style={{
            border: "2px solid #000",
            borderRadius: 8,
            height: 38,
            width: 450,
            boxSizing: "border-box",
            background: "#E4E4E4",

            display: "flex",
            flexDirection: "row"
        }}>
            <div style={{
                width: 54,
                height: "100%",
                borderRight: "1px solid #666666",

                position: "relative"
            }}>
                <div style={{
                    height: "100%",
                    boxSizing: "border-box",
                    border: "2px solid #B2B2B2",
                    background: "#A1A1A1",
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,

                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 6,
                    paddingTop: 2,

                    cursor: "pointer"
                }} onClick={() => setRoomChatStyles(!roomChatStyles)}>
                    <div className="sprite_toolbar_chat_styles" />

                    <div className="sprite_toolbar_chat_pointer" style={{
                        transform: (roomChatStyles) ? ("rotateZ(-90deg)") : (undefined)
                    }} />
                </div>

                {(roomChatStyles) && (
                    <ToolbarChatbarStyles onClose={() => setRoomChatStyles(false)} />
                )}
            </div>

            <div
                contentEditable={true}
                ref={inputRef}
                onKeyUp={(event) => handleKeyUp(event)}
                onKeyDown={(event) => handleKeyDown(event)}
                style={{
                    flex: 1,
                    border: "none",
                    borderTopRightRadius: 8,
                    color: '#333',
                    borderBottomRightRadius: 8,
                    fontSize: 16,
                    background: "transparent",
                    padding: "6px"
                }}>
            </div>
        </div>
    );
}
