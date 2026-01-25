import { useCallback, useContext, useState } from "react";
import { webSocketClient } from "../../../..";
import { SendUserMessageEventData } from "@Shared/Communications/Requests/Rooms/User/SendUserMessageEventData";

export default function ToolbarChatbar() {
    const [value, setValue] = useState("");

    const handleSubmit = useCallback(() => {
        if(!value.length) {
            return;
        }

        webSocketClient.send<SendUserMessageEventData>("SendUserMessageEvent", {
            message: value
        });

        setValue("");
    }, [value]);

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
                borderRight: "1px solid #666666"
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
                    paddingTop: 2
                }}>
                    <div className="sprite_toolbar_chat_styles"/>

                    <div className="sprite_toolbar_chat_pointer"/>
                </div>
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
