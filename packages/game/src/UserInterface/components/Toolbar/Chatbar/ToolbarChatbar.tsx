import { useCallback, useEffect, useRef, useState } from "react";
import { webSocketClient } from "../../../..";
import ToolbarChatbarStyles from "./ToolbarChatbarStyles";
import { useDialogs } from "../../../hooks/useDialogs";
import { SendRoomChatMessageData, SetRoomChatTypingData } from "@pixel63/events";

export default function ToolbarChatbar() {
    const dialogs = useDialogs();

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

    const handleSubmit = useCallback((shout: boolean) => {
        if (!value.length) return;

        setTyping(false);

        if (value[0] === ':' || value[0] === '/') {
            const input = value.split(' ');
            const command = input[0].substring(1);

            switch (command) {
                case "commands":
                    dialogs.addUniqueDialog("room-chat-commands");
                    return;

                case "furni":
                    dialogs.addUniqueDialog("room-furni");
                    return;

                case "figure":
                    dialogs.addUniqueDialog("figure");
                    return;

                case "floor":
                    dialogs.addUniqueDialog("room-floorplan");
                    return;
            }
        }

        webSocketClient.sendProtobuff(
            SendRoomChatMessageData,
            SendRoomChatMessageData.create({
                message: value,
                shout
            })
        );
    }, [dialogs, value]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter") {
                event.preventDefault();

                handleSubmit(event.shiftKey);
                setValue("");
            }
        },
        [handleSubmit, setValue]
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

            <input
                type="text"
                value={value}
                onChange={(event) => setValue((event.target as HTMLInputElement).value)}
                onKeyDown={(event) => handleKeyDown(event)}
                placeholder="Click here to chat..."
                style={{
                    fontFamily: "Ubuntu C",
                    flex: 1,
                    border: "none",
                    borderTopRightRadius: 8,
                    color: '#333',
                    borderBottomRightRadius: 8,
                    fontSize: 16,
                    background: "transparent",
                    padding: "6px"
                }} />
        </div>
    );
}
