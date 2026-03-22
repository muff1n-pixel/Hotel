import { useCallback, useState } from "react";
import { useRoomInstance } from "../../../Hooks/useRoomInstance";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import { webSocketClient } from "../../../..";
import RoomThumbnail from "../Thumbnail/RoomThumbnail";
import { useUser } from "../../../Hooks/useUser";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { useDialogs } from "../../../Hooks/useDialogs";
import { SetUserHomeRoomData } from "@pixel63/events";

export type RoomInformationDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomInformationDialog({ hidden, onClose }: RoomInformationDialogProps) {
    const user = useUser();
    const room = useRoomInstance();
    const dialogs = useDialogs();

    const [homeRoomActive, setHomeRoomActive] = useState(room?.id === user?.homeRoomId);

    const handleHomeRoomClick = useCallback(() => {
        if(!room) {
            return;
        }

        webSocketClient.sendProtobuff(SetUserHomeRoomData, SetUserHomeRoomData.create({
            roomId: (homeRoomActive)?(undefined):(room.id)
        }));

        setHomeRoomActive(!homeRoomActive);
    }, [room, homeRoomActive]);

    if(!room) {
        return null;
    }

    return (
        <Dialog title="Room information" hidden={hidden} onClose={onClose} width={230} height={280}>
            <DialogContent>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <div style={{fontFamily: "Ubuntu C", fontWeight: "bold"}}>{room.information?.name}</div>

                        <div style={{
                            cursor: "pointer"
                        }} onClick={handleHomeRoomClick}>
                            <div className={(homeRoomActive)?("sprite_navigator_home"):("sprite_navigator_home_inactive")}/>
                        </div>
                    </div>

                    <div><b style={{ color: "#7A7A7A" }}>Owner:</b> {room.information?.owner?.name}</div>

                    {(room.information?.description) && (
                        <div>
                            <p style={{fontFamily: "Ubuntu C"}}>{room.information?.description}</p>
                        </div>
                    )}

                    <div style={{
                        flex: 1,

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <RoomThumbnail roomId={room.id} thumbnail={room.information?.thumbnail}/>
                    </div>

                    {(room.hasRights) && (
                        <DialogButton onClick={() => dialogs.addUniqueDialog("room-settings")}>Room settings</DialogButton>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
