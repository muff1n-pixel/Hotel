import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { EnterRoomData, RoomInformationData, RoomLockData } from "@pixel63/events";
import { useCallback, useState } from "react";
import { webSocketClient } from "@Game/index";
import Input from "@UserInterface/Common/Form/Components/Input";
import { useTranslation } from "react-i18next";

export type RoomPasswordDialogProps = {
    data?: RoomLockData;
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomPasswordDialog({ data, hidden, onClose }: RoomPasswordDialogProps) {
    const [getTranslation] = useTranslation("room");
    const [password, setPassword] = useState("");

    const handleSubmit = useCallback(() => {
        if(!data) {
            return null;
        }

        webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
            id: data.roomId,
            password
        }));

        onClose?.();
    }, [data, password, onClose]);

    if(!data) {
        return null;
    }

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

                    <div><p>{getTranslation("doorbell.password_description")}</p></div>

                    <Input type="password" value={password} onChange={setPassword} onSubmit={handleSubmit}/>

                    <div style={{ flex: 1 }}/>

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
                            {getTranslation("doorbell.cancel")}
                        </div>

                        <DialogButton disabled={!password.length} onClick={handleSubmit}>{getTranslation("doorbell.enter")}</DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
