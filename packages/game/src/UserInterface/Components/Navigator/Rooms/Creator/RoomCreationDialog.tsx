import { useCallback, useEffect, useState } from "react";
import Dialog from "../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../Common/Dialog/Components/DialogContent";
import Input from "../../../../Common/Form/Components/Input";
import DialogButton from "../../../../Common/Dialog/Components/Button/DialogButton";
import { webSocketClient } from "../../../../..";
import useRoomMaps from "./Hooks/useRoomMaps";
import { useDialogs } from "../../../../Hooks/useDialogs";
import { useRoomCategories } from "../../../../Hooks/useRoomCategories";
import Selection from "../../../../Common/Form/Components/Selection";
import { CreateRoomData, EnterRoomData, RoomCreatedData, RoomMapData } from "@pixel63/events";
import DialogScrollArea from "../../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import { usePermissionAction } from "@UserInterface/Hooks/usePermissionAction";
import RoomCreationMap from "@UserInterface/Components/Navigator/Rooms/RoomCreationMap";

export type RoomCreationDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomCreationDialog({ hidden, onClose }: RoomCreationDialogProps) {
    const { addUniqueDialog, closeDialog } = useDialogs();

    const roomMaps = useRoomMaps();
    const roomCategories = useRoomCategories();
    const hasRoomMapsPermission = usePermissionAction("room:maps");

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [maxUsers, setMaxUsers] = useState<number>(25);

    const [editMode, setEditMode] = useState<boolean>(false);

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
        <Dialog title="Room Creation" editMode={editMode} onEditClick={hasRoomMapsPermission && (() => setEditMode(!editMode))} hidden={hidden} onClose={onClose} width={600} height={360} style={{
            overflow: "visible"
        }}>
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
                        flex: 1,

                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <div>
                            <b>Choose room layout</b>
                        </div>

                        <DialogScrollArea>
                            <div style={{
                                flex: "1 1 0",
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 10
                            }}>
                                {roomMaps.map((roomMap) => (
                                    <RoomCreationMap key={roomMap.id} roomMap={roomMap} activeRoomMap={activeRoomMap} editMode={editMode} onSelect={() => setActiveRoomMap(roomMap)}/>
                                ))}

                                {(editMode) && (
                                    <div style={{
                                        width: 135,
                                        height: 96,

                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",

                                        cursor: "pointer"
                                    }} onClick={() => addUniqueDialog("edit-room-map")}>
                                        <div className="sprite_add"/>
                                    </div>
                                )}
                            </div>
                        </DialogScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
