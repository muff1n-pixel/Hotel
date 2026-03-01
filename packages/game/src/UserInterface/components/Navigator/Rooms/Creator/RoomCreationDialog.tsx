import { useCallback, useEffect, useState } from "react";
import Dialog from "../../../Dialog/Dialog";
import DialogContent from "../../../Dialog/DialogContent";
import Input from "../../../Form/Input";
import DialogButton from "../../../Dialog/Button/DialogButton";
import RoomMapImage from "../../../Room/Map/RoomMapImage";
import { webSocketClient } from "../../../../..";
import useRoomMaps from "./Hooks/useRoomMaps";
import { useDialogs } from "../../../../hooks/useDialogs";
import { useRoomCategories } from "../../../../hooks/useRoomCategories";
import Selection from "../../../Form/Selection";
import { CreateRoomData, EnterRoomData, RoomCreatedData, RoomMapData } from "@pixel63/events";

export type RoomCreationDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomCreationDialog({ hidden, onClose }: RoomCreationDialogProps) {
    const { closeDialog } = useDialogs();

    const roomMaps = useRoomMaps();
    const roomCategories = useRoomCategories();

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [maxUsers, setMaxUsers] = useState<number>(25);

    const [activeRoomMap, setActiveRoomMap] = useState<RoomMapData>();

    useEffect(() => {
        setActiveRoomMap(roomMaps[0]);
    }, [roomMaps]);
    
    useEffect(() => {
        if(roomCategories?.length) {
            setCategory(roomCategories[0].id);
        }
    }, [roomCategories]);

    const onCreateRoom = useCallback(() => {
        if(!activeRoomMap) {
            return;
        }

        webSocketClient.addProtobuffListener(RoomCreatedData, {
            async handle(payload: RoomCreatedData) {
                closeDialog("room-creation");
                closeDialog("navigator");

                webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
                    id: payload.roomId
                }));
            },
        }, {
            once: true
        });

        webSocketClient.sendProtobuff(CreateRoomData, CreateRoomData.create({
            name,
            description,

            category,

            maxUsers,
            mapId: activeRoomMap.id
        }));
    }, [activeRoomMap, name, description, category, maxUsers]);

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

                            <b>Room category</b>

                            <Selection value={category} items={roomCategories?.map((category) => {
                                return {
                                    value: category.id,
                                    label: category.title
                                };
                            }) ?? []} onChange={(value) => setCategory(value as string)}/>
                            
                            <b>Maximum amount of visitors</b>
            
                            <Selection value={maxUsers} items={Array.from({ length: 10 }, (_, index) => (index + 1) * 5).map((maxUsers) => {
                                return {
                                    value: maxUsers,
                                    label: maxUsers.toString()
                                };
                            }) ?? []} onChange={(value) => setMaxUsers(value as number)}/>
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
