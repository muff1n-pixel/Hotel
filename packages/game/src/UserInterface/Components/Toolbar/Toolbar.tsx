import { useRoomInstance } from "../../Hooks2/useRoomInstance";
import ToolbarChatbar from "./Chatbar/ToolbarChatbar";
import { useEffect, useState } from "react";
import ToolbarFriends from "@UserInterface/Components/Toolbar/ToolbarFriends";
import ToolbarLinks from "@UserInterface/Components/Toolbar/ToolbarLinks";

export default function Toolbar() {
    const room = useRoomInstance();

    const [chatFloating, setChatFloating] = useState(window.innerWidth < 1280);

    useEffect(() => {
        if(!room) {
            return;
        }

        const listener = () => {
            setChatFloating(window.innerWidth < 1280);
        };

        window.addEventListener("resize", listener);

        return () => {
            window.removeEventListener("resize", listener);
        };
    }, [room]);

    return (
        <div style={{
            position: "absolute",
            
            left: 0,
            bottom: 0,

            width: "100%",

            display: "flex",

            borderTop: "1px solid rgba(0, 0, 0, 0.64)",

            pointerEvents: "auto"
        }}>
            <div style={{
                flex: 1,
            
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,

                height: 47,

                background: "rgba(44, 42, 41, 0.64)",

                borderTop: "2px solid rgba(102, 100, 94, 0.64)",
                borderBottom: "1px solid rgba(102, 100, 94, 0.64)",
            }}>
                <ToolbarLinks/>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    position: "relative"
                }}>
                    {(room) && (
                        <ToolbarChatbar style={(chatFloating)?({
                            position: "fixed",

                            left: 0,
                            right: 0,

                            margin: "0 auto",

                            bottom: 60
                        }):(undefined)}/>
                    )}
                </div>

                <ToolbarFriends/>
            </div>
        </div>
    );
}
