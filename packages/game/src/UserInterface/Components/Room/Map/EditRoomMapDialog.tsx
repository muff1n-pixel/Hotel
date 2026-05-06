import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import { DeleteRoomMapData, RoomMapData, RoomStructureData, UpdateRoomMapData } from "@pixel63/events";
import { useCallback, useState } from "react";
import RoomMapImage from "@UserInterface/Components/Room/Map/RoomMapImage";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import Input from "@UserInterface/Common/Form/Components/Input";
import { webSocketClient } from "@Game/index";
import Selection from "@UserInterface/Common/Form/Components/Selection";

export type EditRoomMapDialogProps = {
    data?: {
        map?: RoomMapData;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditRoomMapDialog({ data, hidden, onClose }: EditRoomMapDialogProps) {
    const { openUniqueDialog, closeDialog } = useDialogs();

    const [confirmDelete, setConfirmDelete] = useState(false);

    const [membership, setMembership] = useState(data?.map?.membership ?? undefined);
    const [index, setIndex] = useState(data?.map?.index ?? 0);

    const [structure, setStructure] = useState(RoomStructureData.create({
        grid: data?.map?.grid ?? [
            "XXXXXXXXXXXX",
            "XXXX00000000",
            "XXXX00000000",
            "XXXX00000000",
            "XXXX00000000",
            "XXX000000000",
            "XXXX00000000",
            "XXXX00000000",
            "XXXX00000000",
            "XXXX00000000",
            "XXXX00000000",
            "XXXX00000000",
            "XXXX00000000",
            "XXXX00000000",
            "XXXXXXXXXXXX",
            "XXXXXXXXXXXX"
        ],
        door: data?.map?.door ?? {
            row: 5,
            column: 3,
            direction: 2
        },
        floor: {
            id: "preview",
            thickness: 0
        },
        wall: {
            id: "preview",
            thickness: 0,
            hidden: false
        }
    }));

    const handleUpdate = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomMapData, UpdateRoomMapData.create({
            id: data?.map?.id,

            grid: structure.grid,
            door: structure.door,

            membership,

            index
        }));

        onClose?.();
    }, [index, structure, membership, data, onClose]);

    const handleDelete = useCallback(() => {
        if(!confirmDelete) {
            setConfirmDelete(true);

            return;
        }
        
        if(!data?.map?.id) {
            return;
        }

        webSocketClient.sendProtobuff(DeleteRoomMapData, DeleteRoomMapData.create({
            id: data.map.id,
        }));

        onClose?.();
    }, [confirmDelete, data, onClose]);

    return (
        <Dialog title="Room Map Editor" editMode hidden={hidden} onClose={onClose} initialPosition="center" width={320} assumedHeight={500} height={"auto"}>
            <DialogContent style={{
                gap: 10
            }}>
                <FlexLayout justify="center" align="flex-start">
                    <div style={{ 
                        flex: 1
                    }}>
                        <RoomMapImage size={16} width={250} height={250} structure={structure}/>
                    </div>
                </FlexLayout>

                <DialogButton onClick={() => {
                    openUniqueDialog("room-common-floorplan", {
                        structure,
                        onSave: (structure: RoomStructureData) => {
                            setStructure(structure);

                            closeDialog("room-common-floorplan");
                        }
                    });
                }}>
                    Open floorplan editor
                </DialogButton>

                <b>Index</b>
                <p>This is used to sort the map in the room creation dialog.</p>

                <Input type="number" value={index.toString()} onChange={(value) => setIndex(parseInt(value))}/>
                
                <b>Membership required</b>

                <Selection value={membership} onChange={setMembership} items={[
                    {
                        value: undefined,
                        label: "None"
                    },
                    {
                        value: "habboclub",
                        label: "Habbo Club"
                    }
                ]}/>

                <div style={{
                    display: "flex",
                    gap: 5
                }}>
                    {(data?.map?.id)?(
                        <DialogButton style={{ flex: 1 }} color="red" onClick={handleDelete}>
                            {(!confirmDelete)?("Delete map"):("Confirm deletion")}
                        </DialogButton>
                    ):(
                        <div style={{ flex: 1 }}/>
                    )}

                    <DialogButton style={{ flex: 1 }} onClick={handleUpdate}>
                        {(data?.map?.id)?("Update map"):("Create map")}
                    </DialogButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
