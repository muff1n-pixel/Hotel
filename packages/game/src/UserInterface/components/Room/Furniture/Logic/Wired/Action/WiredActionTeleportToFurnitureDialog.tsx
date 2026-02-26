import WiredDialog from "../../../../../Dialog/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../Dialog/Wired/WiredFurniture";
import WiredDivider from "../../../../../Dialog/Wired/WiredDivider";
import WiredSection from "../../../../../Dialog/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../Dialog/Wired/WiredButton";
import { WiredActionTeleportToFurnitureData } from "@Shared/Interfaces/Room/Furniture/Wired/Action/WiredActionTeleportToFurnitureData";
import { webSocketClient } from "../../../../../../..";
import { SetFurnitureDataEventData } from "@Shared/Communications/Requests/Rooms/Furniture/SetFurnitureDataEventData";
import WiredDelay from "../../../../../Dialog/Wired/WiredDelay";
import WiredFurniturePicker from "../../../../../Dialog/Wired/WiredFurniturePicker";

export type WiredActionTeleportToFurnitureDialogData = {
    furniture: RoomInstanceFurniture<WiredActionTeleportToFurnitureData>;
    type: "wf_act_teleport_to";
};

export default function WiredActionTeleportToFurnitureDialog({ data, onClose }: RoomFurnitureLogicDialogProps<WiredActionTeleportToFurnitureDialogData>) {
    const [furnitureIds, setFurnitureIds] = useState(data.furniture.data.data?.furnitureIds ?? []);
    const [delayInSeconds, setDelayInSeconds] = useState(data.furniture.data.data?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        webSocketClient.send<SetFurnitureDataEventData<WiredActionTeleportToFurnitureData>>("SetFurnitureDataEvent", {
            furnitureId: data.furniture.data.id,
            data: {
                furnitureIds,
                delayInSeconds
            }
        });

        onClose();
    }, [furnitureIds, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furniture.data}/>

            <WiredDivider/>

            <WiredFurniturePicker value={furnitureIds} onChange={setFurnitureIds}/>

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
