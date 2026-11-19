import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { EnterRoomBellQueueData, ExitRoomBellQueueData, RoomInformationData, RoomLockData, UpdateRoomBellQueueData } from "@pixel63/events";
import { useCallback, useEffect, useState } from "react";
import { webSocketClient } from "@Game/index";
import { useTranslation } from "react-i18next";

export type RoomDoorbellDialogProps = {
    data?: RoomLockData;
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomDoorbellDialog({ data, hidden, onClose }: RoomDoorbellDialogProps) {
    const [getTranslation] = useTranslation("room");
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
            roomId: data.roomId
        }));
    }, [data, setRinging]);

    return (
        <Dialog title={getTranslation("doorbell.title")} hidden={hidden} onClose={onClose} width={265} height={180}>
            <DialogContent>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <div><b>{data.roomName}</b></div>

                    <div>
                        {(denied)?(
                            <p>{getTranslation("doorbell.denied")}</p>
                        ):(
                            (ringing)?(
                                <p>{getTranslation("doorbell.ringing")}</p>
                            ):(
                                <p>{getTranslation("doorbell.locked")}</p>
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
                                {(ringing)?(getTranslation("doorbell.cancel_entering")):(getTranslation("doorbell.cancel"))}
                            </div>

                            {(!ringing) && (
                                <DialogButton onClick={handleRingBell}>{getTranslation("doorbell.ring")}</DialogButton>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
