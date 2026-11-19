import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import DialogHeaderContent from "@UserInterface/Common/Dialog/Components/DialogHeaderContent";
import { useCallback } from "react";
import { webSocketClient } from "@Game/index";
import { PickupAllRoomFurnitureData } from "@pixel63/events";
import { useRoom } from "@UserInterface/Hooks/useRoom";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useTranslation } from "react-i18next";

const backgroundImage = new URL('../../../Images/dialog/background-red.png', import.meta.url).toString();

export type RoomPickallDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomPickallDialog({ hidden, onClose }: RoomPickallDialogProps) {
    const [getTranslation] = useTranslation("room");
    const room = useRoomInstance();

    const onPickall = useCallback(() => {
        room?.websocket.sendProtobuff(PickupAllRoomFurnitureData, PickupAllRoomFurnitureData.create({}));

        onClose?.();
    }, [onClose, room]);

    return (
        <Dialog title={getTranslation("commands.pickall.warning")} hidden={hidden} onClose={onClose} width={360} assumedHeight={190} height={"auto"}>
            <DialogHeaderContent header={{
                backgroundImage,

                description: (
                    <div>
                        <div><b>{getTranslation("commands.pickall.destructive")}</b></div>

                        <br/>

                        <div>{getTranslation("commands.pickall.confirm")}</div>
                    </div>
                )
            }}/>

            <DialogContent style={{
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <DialogButton color="red" onClick={onPickall}>{getTranslation("commands.pickall.pick_up")}</DialogButton>
                <DialogButton onClick={onClose}>{getTranslation("commands.pickall.cancel")}</DialogButton>
            </DialogContent>
        </Dialog>
    );
}
