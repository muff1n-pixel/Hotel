import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import DialogHeaderContent from "@UserInterface/Common/Dialog/Components/DialogHeaderContent";
import { useCallback } from "react";
import { webSocketClient } from "@Game/index";
import { PickupAllRoomFurnitureData } from "@pixel63/events";

const backgroundImage = new URL('../../../Images/dialog/background-red.png', import.meta.url).toString();

export type RoomPickallDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomPickallDialog({ hidden, onClose }: RoomPickallDialogProps) {
    const onPickall = useCallback(() => {
        webSocketClient.sendProtobuff(PickupAllRoomFurnitureData, PickupAllRoomFurnitureData.create({}));

        onClose?.();
    }, [onClose]);

    return (
        <Dialog title="Warning!" hidden={hidden} onClose={onClose} width={360} assumedHeight={190} height={"auto"}>
            <DialogHeaderContent header={{
                backgroundImage,

                description: (
                    <div>
                        <div><b>This is a destructive command!</b></div>

                        <br/>

                        <div>Are you sure you want to pick up all furniture from the room?</div>
                    </div>
                )
            }}/>

            <DialogContent style={{
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <DialogButton color="red" onClick={onPickall}>Pick up all furniture</DialogButton>
                <DialogButton onClick={onClose}>Cancel</DialogButton>
            </DialogContent>
        </Dialog>
    );
}
