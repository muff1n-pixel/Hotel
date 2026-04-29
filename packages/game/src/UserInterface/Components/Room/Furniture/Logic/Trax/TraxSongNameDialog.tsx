import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { FurnitureTraxSongData, UpdateRoomFurnitureTraxSongData } from "@pixel63/events";
import TraxButton from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxButton";
import TraxDialog from "@UserInterface/Common/Dialog/Layouts/Trax/TraxDialog";
import Input from "@UserInterface/Common/Form/Components/Input";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useCallback, useState } from "react";
import { webSocketClient } from "@Game/index";

export type TraxSongNameDialogProps = {
    hidden?: boolean;
    data: {
        roomFurniture: RoomFurniture;
        song: {
            id?: string;
            name?: string;
            data: FurnitureTraxSongData;
        };
    };
    onClose?: () => void;
}

export default function TraxSongNameDialog({ hidden, data, onClose }: TraxSongNameDialogProps) {
    const dialogs = useDialogs();

    const [name, setName] = useState(data.song?.name ?? "Untitled Trax");

    const handleSave = useCallback(() => {
        dialogs.closeDialog("trax-song-name");
        dialogs.closeDialog("trax-editor");

        dialogs.openUniqueDialog("trax-playlists", {
            roomFurniture: data.roomFurniture
        });

        webSocketClient.sendProtobuff(UpdateRoomFurnitureTraxSongData, UpdateRoomFurnitureTraxSongData.create({
            roomFurnitureId: data.roomFurniture.data.id,
            
            name,

            songId: data.song.id,
            song: data.song.data
        }));
    }, [ dialogs, data, name ]);

    return (
        <TraxDialog title="Save your song" hidden={hidden} onClose={onClose} width={260} height={120} initialPosition="center" style={{
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            <div><b>Trax name:</b></div>

            <Input value={name} onChange={setName}/>

            <TraxButton containerStyle={{ alignSelf: "flex-end" }} onClick={handleSave}>Save</TraxButton>
        </TraxDialog>
    );
}
