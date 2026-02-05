import { useCallback, useContext, useState } from "react";
import { useRoomInstance } from "../../../hooks/useRoomInstance";
import Dialog from "../../Dialog/Dialog";
import DialogContent from "../../Dialog/DialogContent";
import { AppContext } from "../../../contexts/AppContext";
import { webSocketClient } from "../../../..";
import { SetHomeRoomEventData } from "@Shared/Communications/Requests/User/SetHomeRoomEventData";

export type RoomInformationDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomInformationDialog({ hidden, onClose }: RoomInformationDialogProps) {
    const { user } = useContext(AppContext);

    const room = useRoomInstance();

    const [homeRoomActive, setHomeRoomActive] = useState(room?.id === user?.homeRoomId);

    const handleHomeRoomClick = useCallback(() => {
        if(!room) {
            return;
        }

        webSocketClient.send<SetHomeRoomEventData>("SetHomeRoomEvent", {
            roomId: (homeRoomActive)?(null):(room.id)
        });

        setHomeRoomActive(!homeRoomActive);
    }, [room, homeRoomActive]);

    if(!room) {
        return null;
    }

    return (
        <Dialog title="Room information" hidden={hidden} onClose={onClose} width={230} height={450}>
            <DialogContent>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <div>
                            <b>{room.information.name}</b>
                        </div>

                        <div style={{
                            cursor: "pointer"
                        }} onClick={handleHomeRoomClick}>
                            <div className={(homeRoomActive)?("sprite_navigator_home"):("sprite_navigator_home_inactive")}/>
                        </div>
                    </div>

                    <div><b style={{ color: "#7A7A7A" }}>Owner:</b> {room.information.owner.name}</div>

                    <div>
                        <p>
                            {room.information.description}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
