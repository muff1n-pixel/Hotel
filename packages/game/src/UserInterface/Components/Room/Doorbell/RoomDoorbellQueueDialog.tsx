import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { RoomBellQueueUserData, UpdateRoomBellQueueData } from "@pixel63/events";
import { Fragment, useCallback } from "react";
import { webSocketClient } from "@Game/index";
import DialogTable from "@UserInterface/Common/Dialog/Components/Table/DialogTable";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useTranslation } from "react-i18next";

export type RoomDoorbellQueueDialogProps = {
    data?: RoomBellQueueUserData[];
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomDoorbellQueueDialog({ data, hidden, onClose }: RoomDoorbellQueueDialogProps) {
    const [getTranslation] = useTranslation("room");
    const room = useRoomInstance();

    if(!data) {
        return null;
    }

    const handleAcceptAll = useCallback(() => {
        for(const user of data) {
            room?.websocket.sendProtobuff(UpdateRoomBellQueueData, UpdateRoomBellQueueData.create({
                userId: user.id,
                accept: true
            }));
        }
    }, [data, room]);

    const handleDenyAll = useCallback(() => {
        for(const user of data) {
            room?.websocket.sendProtobuff(UpdateRoomBellQueueData, UpdateRoomBellQueueData.create({
                userId: user.id,
                accept: false
            }));
        }
    }, [data, room]);

    return (
        <Dialog title={getTranslation("doorbell.queue_title")} hidden={hidden} onClose={onClose} width={265} height={180}>
            <DialogContent>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <div>{getTranslation("doorbell.queue_description")}</div>

                    <DialogTable items={data.map((user) => ({
                        id: user.id,
                        values: [user.name],
                        tools: (
                            <Fragment>
                                <div className="sprite_friends_accept" style={{
                                    cursor: "pointer"
                                }} onClick={() => {
                                    webSocketClient.sendProtobuff(UpdateRoomBellQueueData, UpdateRoomBellQueueData.create({
                                        userId: user.id,
                                        accept: true
                                    }));
                                }}/>
                                
                                <div className="sprite_friends_decline" style={{
                                    cursor: "pointer"
                                }} onClick={() => {
                                    webSocketClient.sendProtobuff(UpdateRoomBellQueueData, UpdateRoomBellQueueData.create({
                                        userId: user.id,
                                        accept: false
                                    }));
                                }}/>
                            </Fragment>
                        )
                    }))}/>

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
                        }} onClick={handleDenyAll}>
                            {getTranslation("doorbell.deny_all")}
                        </div>

                        <DialogButton onClick={handleAcceptAll}>{getTranslation("doorbell.accept_all")}</DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
