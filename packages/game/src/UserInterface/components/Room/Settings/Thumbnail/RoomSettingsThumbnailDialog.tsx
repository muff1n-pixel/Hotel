import { useCallback, useRef } from "react";
import DialogButton from "../../../Dialog/Button/DialogButton";
import Dialog from "../../../Dialog/Dialog";
import DialogContent from "../../../Dialog/DialogContent";
import RoomCameraRenderer from "../../Camera/RoomCameraRenderer";
import { useRoomInstance } from "../../../../hooks/useRoomInstance";
import { webSocketClient } from "../../../../..";
import { useDialogs } from "../../../../hooks/useDialogs";
import { UpdateRoomInformationData } from "@pixel63/events";

export type RoomSettingsThumbnailDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomSettingsThumbnailDialog({ hidden, onClose }: RoomSettingsThumbnailDialogProps) {
    const dialogs = useDialogs();
    const room = useRoomInstance();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleCapture = useCallback(() => {
        if(!room) {
            return;
        }

        const dataUrl = canvasRef.current?.toDataURL("image/png");

        if(!dataUrl) {
            throw new Error("Could not create a data url from the canvas.");
        }

        webSocketClient.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            thumbnail: dataUrl
        }));

        dialogs.closeDialog("room-settings-thumbnail");
    }, [room, dialogs, canvasRef]);

    return (
        <Dialog title="Camera" hidden={hidden} onClose={onClose} width={150} height={210}>
            <DialogContent>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10
                }}>
                    <div style={{
                        flex: 1,
                        
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <div style={{
                            border: "1px solid #000",
                            background: "green",
                            width: 110,
                            height: 110
                        }}>
                            <RoomCameraRenderer canvasRef={canvasRef} width={110} height={110}/>
                        </div>
                    </div>

                    <div>
                        <DialogButton onClick={handleCapture}>Capture</DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
