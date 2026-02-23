import { useCallback, useEffect, useState } from "react";
import { webSocketClient } from "../../../..";
import { SendUserMessageEventData } from "@Shared/Communications/Requests/Rooms/User/SendUserMessageEventData";
import { SetTypingEventData } from "@Shared/Communications/Requests/Rooms/User/SetTypingEventData";
import ToolbarChatbarStyles from "./ToolbarChatbarStyles";
import { useDialogs } from "../../../hooks/useDialogs";

export default function ToolbarChatbar() {
    const dialogs = useDialogs();

    const [value, setValue] = useState("");
    const [roomChatStyles, setRoomChatStyles] = useState(false);
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        if(value.length && !typing) {
            setTyping(true);

            return;
        }

        if(!value.length && typing) {
            setTyping(false);
        }
    }, [value, typing]);

    useEffect(() => {
        webSocketClient.send<SetTypingEventData>("SetTypingEvent", {
            typing: (value.length)?(true):(false)
        });
    }, [typing]);

    const handleSubmit = useCallback(() => {
        if(!value.length) {
            return;
        }

        setTyping(false);
        setValue("");

        if(value[0] === ':' || value[0] === '/') {
            const input = value.split(' ');

            const command = input[0].substring(1);

            switch(command) {
                case "furni": {
                    dialogs.addUniqueDialog("room-furni");

                    return;
                }

                case "enable": {
                    if(input.length === 1) {
                        dialogs.addUniqueDialog("figure-catalog");

                        return;
                    }

                    break;
                }

                case "carry": {
                    if(input.length === 1) {
                        dialogs.addUniqueDialog("figure-catalog");

                        return;
                    }

                    break;
                }

                case "floor": {
                    dialogs.addUniqueDialog("room-floorplan");
                    
                    return;
                }
            }
        }

        webSocketClient.send<SendUserMessageEventData>("SendUserMessageEvent", {
            message: value
        });
    }, [dialogs, value]);

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
                    <div className="sprite_toolbar_chat_styles"/>

                    <div className="sprite_toolbar_chat_pointer" style={{
                        transform: (roomChatStyles)?("rotateZ(-90deg)"):(undefined)
                    }}/>
                </div>

                {(roomChatStyles) && (
                    <ToolbarChatbarStyles onClose={() => setRoomChatStyles(false)}/>
                )}
            </div>

            <input
                type="text"
                value={value}
                onChange={(event) => setValue((event.target as HTMLInputElement).value)}
                onKeyUp={(event) => event.key === "Enter" && handleSubmit()}
                placeholder="Click here to chat..."
                style={{
                    flex: 1,
                    border: "none",
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                    fontSize: 16,
                    background: "transparent",
                    padding: "0 6px"
                }}/>
        </div>
    );
}
