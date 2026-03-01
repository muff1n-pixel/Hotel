import { SetUserRoomChatStyleData } from "@pixel63/events";
import { webSocketClient } from "../../../..";
import { useRoomChatStyles } from "../../../hooks/useRoomChatStyles";

export type ToolbarChatbarStylesProps = {
    onClose: () => void;
}

export default function ToolbarChatbarStyles({ onClose }: ToolbarChatbarStylesProps) {
    const roomChatStyles = useRoomChatStyles();

    return (
        <div style={{
            position: "absolute",

            bottom: "100%",
            marginBottom: 20,

            background: "rgba(0, 0, 0, .6)",
            borderRadius: 6,

            transform: "translateX(-50%) translateX(27px)",

            display: "grid",
            gridTemplateColumns: "64px 64px 64px",
            gap: 4,
            padding: 6
        }}>
            {roomChatStyles?.map((roomChatStyle) => (
                <div key={roomChatStyle} style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <img src={`/assets/room/chat/${roomChatStyle}_selector_preview_png.png`} style={{
                        cursor: "pointer"
                    }} onClick={() => {
                        webSocketClient.sendProtobuff(SetUserRoomChatStyleData, SetUserRoomChatStyleData.create({
                            id: roomChatStyle
                        }));

                        onClose();
                    }}/>
                </div>
            ))}
        </div>
    );
}
