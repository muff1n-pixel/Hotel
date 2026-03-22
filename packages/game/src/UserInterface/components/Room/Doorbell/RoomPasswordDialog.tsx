import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { EnterRoomData, RoomInformationData } from "@pixel63/events";
import { useCallback, useState } from "react";
import { webSocketClient } from "src";
import Input from "@UserInterface/Common/Form/Components/Input";

export type RoomPasswordDialogProps = {
    data?: RoomInformationData;
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomPasswordDialog({ data, hidden, onClose }: RoomPasswordDialogProps) {
    const [password, setPassword] = useState("");

    const handleSubmit = useCallback(() => {
        if(!data) {
            return null;
        }

        webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
            id: data.id,
            password
        }));

        onClose?.();
    }, [data, password, onClose]);

    if(!data) {
        return null;
    }

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

                    <div><p>This room is protected by a password.</p></div>

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
                            Cancel
                        </div>

                        <DialogButton disabled={!password.length} onClick={handleSubmit}>Enter room</DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
