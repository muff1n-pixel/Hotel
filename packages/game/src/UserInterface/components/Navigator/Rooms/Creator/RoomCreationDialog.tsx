import { useCallback, useEffect, useState } from "react";
import Dialog from "../../../Dialog/Dialog";
import DialogContent from "../../../Dialog/DialogContent";
import Input from "../../../Form/Input";
import DialogButton from "../../../Dialog/Button/DialogButton";
import RoomMapImage from "../../../Room/Map/RoomMapImage";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { RoomMapData } from "@Shared/Communications/Responses/Navigator/RoomMapsEventData";
import { webSocketClient } from "../../../../..";
import { CreateRoomEventData } from "@Shared/Communications/Requests/Navigator/CreateRoomEventData";
import { RoomCreatedEventData } from "@Shared/Communications/Responses/Navigator/RoomCreatedEventData";
import { EnterRoomEventData } from "@Shared/Communications/Requests/Rooms/EnterRoomEventData";
import useRoomMaps from "./Hooks/useRoomMaps";
import { useDialogs } from "../../../../hooks/useDialogs";

export type RoomCreationDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomCreationDialog({ hidden, onClose }: RoomCreationDialogProps) {
    const { closeDialog } = useDialogs();

    const roomMaps = useRoomMaps();

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [activeRoomMap, setActiveRoomMap] = useState<RoomMapData>();

    useEffect(() => {
        setActiveRoomMap(roomMaps[0]);
    }, [roomMaps]);

    const onCreateRoom = useCallback(() => {
        if(!activeRoomMap) {
            return;
        }

        const listener = (event: WebSocketEvent<RoomCreatedEventData>) => {
            if(!event.data.success) {
                alert("fail");
            }

            closeDialog("room-creation");
            closeDialog("navigator");

            webSocketClient.send<EnterRoomEventData>("EnterRoomEvent", {
                roomId: event.data.roomId
            });
        };

        webSocketClient.addEventListener<WebSocketEvent<RoomCreatedEventData>>("RoomCreatedEvent", listener, {
            once: true
        });

        webSocketClient.send<CreateRoomEventData>("CreateRoomEvent", {
            name: (name.length)?(name):("My room"),
            description,

            mapId: activeRoomMap.id
        });
    }, [activeRoomMap, name, description]);

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

                                    cursor: "pointer",

                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }} onClick={() => setActiveRoomMap(roomMap)}>
                                    <RoomMapImage crop={true} width={135} height={96} style={{
                                    }} structure={{
                                        grid: roomMap.grid,
                                        door: roomMap.door,
                                        floor: {
                                            id: "preview",
                                            thickness: 0
                                        },
                                        wall: {
                                            id: "preview",
                                            thickness: 0,
                                            hidden: false
                                        }
                                    }} leftWallColor={["D48612"]}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
