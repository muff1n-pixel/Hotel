import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Dialog from "../../../Dialog/Dialog";
import DialogContent from "../../../Dialog/DialogContent";
import Input from "../../../Form/Input";
import DialogButton from "../../../Dialog/Button/DialogButton";
import RoomMapImage from "../../../Room/Map/RoomMapImage";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { RoomMapData, RoomMapsResponse } from "@Shared/WebSocket/Events/Rooms/Maps/RoomMapsResponse";
import { webSocketClient } from "../../../../..";
import { RoomCreatedRequest } from "@Shared/WebSocket/Events/Rooms/Maps/RoomCreatedRequest";
import { RoomCreatedResponse } from "@Shared/WebSocket/Events/Rooms/Maps/RoomCreatedResponse";
import { AppContext } from "../../../../contexts/AppContext";
import { EnterRoomEventData } from "@Shared/Communications/Rooms/Requests/EnterRoomEventData";

export type RoomCreationDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomCreationDialog({ hidden, onClose }: RoomCreationDialogProps) {
    const { closeDialog } = useContext(AppContext);

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const roomMapsRequested = useRef(false);

    const [roomMaps, setRoomMaps] = useState<RoomMapData[]>([]);
    const [activeRoomMap, setActiveRoomMap] = useState<RoomMapData>();

    useEffect(() => {
        if(roomMapsRequested.current) {
            return;
        }

        roomMapsRequested.current = true;

        
        const listener = (event: WebSocketEvent<RoomMapsResponse>) => {
            setRoomMaps(event.data);
            setActiveRoomMap(event.data[0]);
        };

        webSocketClient.addEventListener<WebSocketEvent<RoomMapsResponse>>("RoomMapsResponse", listener, {
            once: true
        });

        webSocketClient.send("RoomMapsRequest", null);
    }, []);

    const onCreateRoom = useCallback(() => {
        if(!activeRoomMap) {
            return;
        }

        const listener = (event: WebSocketEvent<RoomCreatedResponse>) => {
            if(!event.data.success) {
                alert("fail");
            }

            closeDialog("room-creation");

            webSocketClient.send<EnterRoomEventData>("EnterRoomEvent", {
                roomId: event.data.roomId
            });
        };

        webSocketClient.addEventListener<WebSocketEvent<RoomCreatedResponse>>("RoomCreatedResponse", listener, {
            once: true
        });

        webSocketClient.send<RoomCreatedRequest>("RoomCreatedRequest", {
            name,
            description,

            mapId: activeRoomMap.id
        });
    }, [activeRoomMap]);

    return (
        <Dialog title="Room Creation" hidden={hidden} onClose={onClose} width={580} height={360}>
            <DialogContent>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "row",
                    gap: 10
                }}>
                    <div style={{
                        flex: 1,

                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",
                            gap: 10
                        }}>
                            <b>Room name</b>

                            <Input placeholder="My room name" value={name} onChange={setName}/>
                            
                            <b>Room description</b>

                            <Input placeholder="My room description" value={description} onChange={setDescription}/>
                        </div>

                        <DialogButton onClick={onCreateRoom}>Create room</DialogButton>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <div>
                            <b>Choose room layout</b>
                        </div>

                        <div style={{
                            flex: "1 1 0",
                            overflowY: "scroll",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 10
                        }}>
                            {roomMaps.map((roomMap) => (
                                <div key={roomMap.id} style={{
                                    width: 135,
                                    height: 96,

                                    border: "1px solid #5D5D5A",
                                    background: (activeRoomMap?.id === roomMap.id)?("#6E8184"):("#CBCBCB"),

                                    borderRadius: 6,
                                    overflow: "hidden",

                                    position: "relative",

                                    cursor: "pointer"
                                }} onClick={() => setActiveRoomMap(roomMap)}>
                                    <RoomMapImage width={135} height={96} style={{
                                        position: "absolute",

                                        left: "-100%",
                                        top: "-100%",
                                        right: "-100%",
                                        bottom: "-100%",

                                        margin: "auto"
                                    }} structure={{
                                        grid: roomMap.grid,
                                        door: roomMap.door,
                                        floor: {
                                            id: "101",
                                            thickness: 0
                                        },
                                        wall: {
                                            id: "206",
                                            thickness: 0
                                        }
                                    }}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
