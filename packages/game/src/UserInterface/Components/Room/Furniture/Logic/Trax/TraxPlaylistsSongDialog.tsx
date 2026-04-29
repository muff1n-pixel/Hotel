import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { GetUserInventorySongDisksData, InsertRoomFurnitureTraxSongData, UserFurnitureData, UserInventorySongDisksData } from "@pixel63/events";
import DialogScrollArea from "@UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import TraxButton from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxButton";
import TraxDialogListPanel from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogListPanel";
import TraxDialogListPanelItem from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogListPanelItem";
import TraxDialog from "@UserInterface/Common/Dialog/Layouts/Trax/TraxDialog";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useDialogs } from "@UserInterface/Hooks2/useDialogs";
import { useCallback, useEffect, useState } from "react";
import { webSocketClient } from "@Game/index";

export type TraxPlaylistsSongDialogProps = {
    hidden?: boolean;
    data: {
        roomFurniture: RoomFurniture;
    };
    onClose?: () => void;
}

export default function TraxPlaylistsSongDialog({ hidden, data, onClose }: TraxPlaylistsSongDialogProps) {
    const dialogs = useDialogs();

    const [activeSong, setActiveSong] = useState<UserFurnitureData>();

    const [songs, setSongs] = useState<UserFurnitureData[]>([]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserInventorySongDisksData, {
            async handle(payload: UserInventorySongDisksData) {
                setSongs(payload.disks);
            }
        });

        webSocketClient.sendProtobuff(GetUserInventorySongDisksData, GetUserInventorySongDisksData.create({}));

        return () => {
            webSocketClient.removeProtobuffListener(UserInventorySongDisksData, listener);
        };
    }, []);

    const handleInsert = useCallback(() => {
        if(!activeSong) {
            return;
        }

        webSocketClient.sendProtobuff(InsertRoomFurnitureTraxSongData, InsertRoomFurnitureTraxSongData.create({
            roomFurnitureId: data.roomFurniture.data.id,
            songFurnitureId: activeSong.id
        }));

        onClose?.();
    }, [activeSong, data, dialogs, onClose]);

    return (
        <TraxDialog title="Insert a song disk" hidden={hidden} onClose={onClose} width={260} height={220} initialPosition="center" style={{
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            <div><b>Your song disks:</b></div>

            <TraxDialogListPanel style={{
                flex: "1 1 0",

                display: "flex",
                overflow: "hidden"
            }}>
                <DialogScrollArea hideInactive style={{ gap: 5 }} contentStyle={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 5
                }}>
                    {(songs.length)?(
                        songs.map((song) => (
                            <TraxDialogListPanelItem key={song.id} active={song.id === activeSong?.id} onClick={() => setActiveSong(song)}>
                                <FlexLayout direction="row">
                                    <div className="sprite_dialog_trax_cd"/>

                                    <div>
                                        {song.name ?? "Untitled Song"}
                                    </div>
                                </FlexLayout>
                            </TraxDialogListPanelItem>
                        ))
                    ):(
                        <div style={{ color: "#97D5CE", textAlign: "center" }}><i>You have no song disks in your inventory</i></div>
                    )}
                </DialogScrollArea>
            </TraxDialogListPanel>

            <TraxButton containerStyle={{ alignSelf: "flex-end" }} onClick={handleInsert}>Insert</TraxButton>
        </TraxDialog>
    );
}
