import { useEffect } from "react";
import ToolbarToggle from "../../Toolbar/ToolbarToggle";
import { useRoomInstance } from "../../../hooks/useRoomInstance";
import RoomChatRenderer from "@Client/Room/Chat/RoomChatRenderer";
import { clientInstance, webSocketClient } from "../../../..";
import OffscreenCanvasRender from "../../OffscreenCanvasRender";
import { useRoomHistory } from "../../../hooks/useRoomHistory";
import { RoomActorChatData } from "@pixel63/events";

export type ToolbarRoomChatProps = {
    minimized: boolean;
    onMinimized: (minimized: boolean) => void;
}

export type RoomHistory = RoomChatMessage | RoomEntry;

type RoomChatMessage = {
    id: number;
    type: "message";
    image: ImageBitmap;
    timestamp: Date;
};

type RoomEntry = {
    id: number;
    type: "room";
    name: string;
    timestamp: Date;
};

export default function ToolbarRoomChat({ minimized, onMinimized }: ToolbarRoomChatProps) {
    const room = useRoomInstance();

    const history = useRoomHistory();
    
    useEffect(() => {
        if(!room) {
            return;
        }

        const listener = webSocketClient.addProtobuffListener(RoomActorChatData, {
            async handle(payload: RoomActorChatData) {
                if(!payload.actor?.user) {
                    return;
                }
                
                const user = room.getUserById(payload.actor.user.userId);

                const image = await RoomChatRenderer.render(payload.roomChatStyleId, user.data.name, user.data.figureConfiguration, payload.message, {
                    $type: "RoomActorChatOptionsData"
                });

                clientInstance.roomHistory.value!.push({
                    id: Math.random(),
                    type: "message",
                    image,
                    timestamp: new Date(),
                } satisfies RoomChatMessage);

                clientInstance.roomHistory.update();
            },
        })

        return () => {
            webSocketClient.removeProtobuffListener(RoomActorChatData, listener);
        };
    }, [room, history]);
    
    useEffect(() => {
        if(!room) {
            return;
        }

        const latest = clientInstance.roomHistory.value![clientInstance.roomHistory.value!.length - 1];

        if(latest && latest.type === "room" && latest.name === room.information?.name) {
            return;
        }

        clientInstance.roomHistory.value!.push({
            id: Math.random(),
            type: "room",
            name: room.information?.name ?? "",
            timestamp: new Date(),
        } satisfies RoomEntry);

        clientInstance.roomHistory.update();
    }, [room]);

    return (
        <div style={{
            flex: "1 1 0",
                width: "33vw",
            overflow: "hidden"
        }}>
            <div style={{
                position: "absolute",

                display: (minimized)?("none"):("block"),

                left: 0,
                top: 0,
                bottom: 0,

                width: "33vw",

                background: "rgba(28, 28, 26, .9)",
                borderRight: "2px solid rgba(64, 64, 64, .75)",
            }}>
                <div style={{
                    position: "absolute",
                    left: "100%",
                    bottom: 100,

                    height: 60,
    
                    pointerEvents: "auto"
                }}>
                    <ToolbarToggle toggled={minimized} onToggle={onMinimized}/>
                </div>
            </div>

            {(!minimized) && (
                <div style={{
                    position: "relative",
                    padding: 6,
                    paddingBottom: 12,
                    boxSizing: "border-box",

                    height: "100%",

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",

                    pointerEvents: "auto"
                }}>
                    {history!.map((history) => {
                        switch(history.type) {
                            case "message":
                                return (
                                    <div key={history.id} style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 10,
                                        fontSize: 12,
                                        alignItems: "center"
                                    }}>
                                        <div style={{ color: "#9A9A99", fontFamily: "Ubuntu Italic" }}>{history.timestamp.toTimeString().split(' ')[0]}</div>

                                        <OffscreenCanvasRender offscreenCanvas={history.image}/>
                                    </div>
                                );
                                
                            case "room":
                                return (
                                    <div key={history.id} style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 10,
                                        fontSize: 12,
                                        alignItems: "center",
                                        height: 30
                                    }}>
                                        <div style={{ color: "#9A9A99", fontFamily: "Ubuntu Italic" }}>{history.timestamp.toTimeString().split(' ')[0]}</div>

                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 5
                                        }}>
                                            <div className="sprite_toolbar_room_room"/>

                                            <div style={{ color: "#F30101" }}>{history.name}</div>
                                        </div>
                                    </div>
                                );
                        }
                    })}
                </div>
            )}
        </div>
    );
}
