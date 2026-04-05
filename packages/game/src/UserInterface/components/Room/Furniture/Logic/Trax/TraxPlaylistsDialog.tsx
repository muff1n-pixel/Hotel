import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import DialogScrollArea from "@UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import TraxButton from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxButton";
import TraxDialogListPanel from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogListPanel";
import TraxDialogListPanelItem from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogListPanelItem";
import TraxDialogPanel from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogPanel";
import TraxDialog from "@UserInterface/Common/Dialog/Layouts/Trax/TraxDialog";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useCallback } from "react";

export type TraxPlaylistsDialogProps = {
    hidden?: boolean;
    data: {
        roomFurniture: RoomFurniture;
    };
    onClose?: () => void;
}

export default function TraxPlaylistsDialog({ hidden, data, onClose }: TraxPlaylistsDialogProps) {
    const dialogs = useDialogs();

    const handleEditSong = useCallback(() => {
        onClose?.();

        dialogs.openUniqueDialog("trax-editor", data);
    }, [dialogs, onClose]);

    return (
        <TraxDialog title="Trax Playlists" hidden={hidden} onClose={onClose} width={540} height={330} initialPosition="center" style={{
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            <FlexLayout flex={1} direction="row" style={{ flex: 1 }}>
                <FlexLayout flex={4}>
                    <div style={{ textAlign: "center" }}><b>Traxmachine Songs</b></div>

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
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                        </DialogScrollArea>
                    </TraxDialogListPanel>

                    <FlexLayout direction="row">
                        <TraxButton onClick={handleEditSong} containerStyle={{ flex: 1}}>
                            Edit song
                        </TraxButton>
                        
                        <TraxButton>
                            <div className="sprite_dialog_trax_trash"/>
                        </TraxButton>
                    </FlexLayout>
                    
                    <TraxButton>
                        Create a new song
                    </TraxButton>
                </FlexLayout>

                <div>
                    <TraxButton containerStyle={{
                        alignSelf: "center",

                        marginTop: 64
                    }}>
                        <div className="sprite_dialog_trax_add"/>
                    </TraxButton>
                </div>

                <FlexLayout flex={4}>
                    <div style={{ textAlign: "center" }}><b>Playlist</b></div>

                    <FlexLayout direction="row" style={{
                        flex: "3 1 0",
                        display: "flex",
                        overflow: "hidden"
                    }}>
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
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                                <TraxDialogListPanelItem>Song 1</TraxDialogListPanelItem>
                            </DialogScrollArea>
                        </TraxDialogListPanel>
                    </FlexLayout>

                    <div style={{ padding: "0 10px" }}>
                        <TraxButton>Save Playlist</TraxButton>
                    </div>

                    <div style={{ textAlign: "center", color: "#97D5CE" }}><b>Song Info</b></div>

                    <TraxDialogPanel containerStyle={{ flex: 2 }} style={{ display: "flex", padding: "10px" }}>
                        <FlexLayout flex={1} align="center" gap={2}>
                            <div><b>Song 1</b></div>

                            <div style={{ color: "#97D5CE" }}>2:20min</div>

                            <div style={{ flex: 1 }}/>

                            <TraxButton style={{ paddingLeft: 20, paddingRight: 20}}>Burn Song</TraxButton>
                        </FlexLayout>
                    </TraxDialogPanel>
                </FlexLayout>
            </FlexLayout>
        </TraxDialog>
    );
}
