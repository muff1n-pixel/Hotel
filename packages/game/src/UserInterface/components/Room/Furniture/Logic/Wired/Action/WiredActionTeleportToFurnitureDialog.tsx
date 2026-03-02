import WiredDialog from "../../../../../Dialog/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../Dialog/Wired/WiredFurniture";
import WiredDivider from "../../../../../Dialog/Wired/WiredDivider";
import WiredSection from "../../../../../Dialog/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../Dialog/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredDelay from "../../../../../Dialog/Wired/WiredDelay";
import WiredFurniturePicker from "../../../../../Dialog/Wired/WiredFurniturePicker";
import { UpdateRoomFurnitureData } from "@pixel63/events";

export type WiredActionTeleportToFurnitureDialogData = {
    furniture: RoomInstanceFurniture;
    type: "wf_act_teleport_to";
};

export default function WiredActionTeleportToFurnitureDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredActionTeleportToFurniture?.furnitureIds ?? []);
    const [delayInSeconds, setDelayInSeconds] = useState(data.data.data?.wiredActionTeleportToFurniture?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                wiredActionTeleportToFurniture: {
                    furnitureIds,
                    delayInSeconds
                }
            }
        }));

        onClose();
    }, [furnitureIds, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.data}/>

            <WiredDivider/>

            <WiredFurniturePicker value={furnitureIds} onChange={setFurnitureIds} maxFurniture={5}/>

            <WiredDivider/>

            <WiredDelay value={delayInSeconds} onChange={setDelayInSeconds}/>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
