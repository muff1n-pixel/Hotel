import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { EnterRoomBellQueueData, ExitRoomBellQueueData, RoomInformationData, UpdateRoomBellQueueData } from "@pixel63/events";
import { useCallback, useEffect, useState } from "react";
import { webSocketClient } from "@Game/index";

export type RoomDoorbellDialogProps = {
    data?: RoomInformationData;
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomDoorbellDialog({ data, hidden, onClose }: RoomDoorbellDialogProps) {
    if(!data) {
        return null;
    }

    const [ringing, setRinging] = useState(false);
    const [denied, setDenied] = useState(false);

    useEffect(() => {
        if(!data) {
            return;
        }

        if(!ringing) {
            return;
        }

        const listener = webSocketClient.addProtobuffListener(UpdateRoomBellQueueData, {
            async handle(payload: UpdateRoomBellQueueData) {
                if(!payload.accept) {
                    setDenied(true);
                }
                else {
                    onClose?.();
                }
            },
        });

        return () => {
            setRinging(false);

            webSocketClient.removeProtobuffListener(UpdateRoomBellQueueData, listener);
            webSocketClient.sendProtobuff(ExitRoomBellQueueData, ExitRoomBellQueueData.create({}));
        };
    }, [data, ringing, onClose]);

    const handleRingBell = useCallback(() => {
        if(!data) {
            return null;
        }

        setRinging(true);

        webSocketClient.sendProtobuff(EnterRoomBellQueueData, EnterRoomBellQueueData.create({
            roomId: data.id
        }));
    }, [data, setRinging]);

    return (
        <Dialog title="Room Doorbell" hidden={hidden} onClose={onClose} width={265} height={180}>
            <DialogContent>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <div><b>{data.name}</b></div>

                    <div>
                        {(denied)?(
                            <p>Sorry, you were not allowed into the room. Try another door!</p>
                        ):(
                            (ringing)?(
                                <p>The doorbell is ringing, waiting for someone to open the door...</p>
                            ):(
                                <p>This room is locked. You need to ring the doorbell to enter.</p>
                            )
                        )}
                    </div>

                    <div style={{ flex: 1 }}/>

                    {(!denied) && (
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                            height: 24
                        }}>
                            <div style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                            }} onClick={onClose}>
                                {(ringing)?("Cancel entering the room"):("Cancel")}
                            </div>

                            {(!ringing) && (
                                <DialogButton onClick={handleRingBell}>Ring doorbell</DialogButton>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
