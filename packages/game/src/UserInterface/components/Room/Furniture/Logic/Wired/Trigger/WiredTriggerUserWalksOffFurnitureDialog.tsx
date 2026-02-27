import WiredDialog from "../../../../../Dialog/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../Dialog/Wired/WiredFurniture";
import WiredDivider from "../../../../../Dialog/Wired/WiredDivider";
import WiredSection from "../../../../../Dialog/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../Dialog/Wired/WiredButton";
import { WiredTriggerUserWalksOffFurnitureData } from "@Shared/Interfaces/Room/Furniture/Wired/Trigger/WiredTriggerUserWalksOffFurnitureData";
import { webSocketClient } from "../../../../../../..";
import { SetFurnitureDataEventData } from "@Shared/Communications/Requests/Rooms/Furniture/SetFurnitureDataEventData";
import WiredFurniturePicker from "../../../../../Dialog/Wired/WiredFurniturePicker";
import WiredFurnitureSource from "../../../../../Dialog/Wired/WiredFurnitureSource";

export type WiredTriggerUserWalksOffFurnitureDialog = {
    furniture: RoomInstanceFurniture<WiredTriggerUserWalksOffFurnitureData>;
    type: "wf_trg_says_something";
};

export default function WiredTriggerUserWalksOffFurnitureDialog({ data, onClose }: RoomFurnitureLogicDialogProps<WiredTriggerUserWalksOffFurnitureDialog>) {
    const [furnitureIds, setFurnitureIds] = useState(data.furniture.data.data?.furnitureIds ?? []);
    const [furnitureSource, setFurnitureSource] = useState(data.furniture.data.data?.furnitureSource ?? "list");

    const handleApply = useCallback(() => {
        webSocketClient.send<SetFurnitureDataEventData<WiredTriggerUserWalksOffFurnitureData>>("SetFurnitureDataEvent", {
            furnitureId: data.furniture.data.id,
            data: {
                furnitureIds,
                furnitureSource
            }
        });

        onClose();
    }, [furnitureIds, furnitureSource, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furniture.data}/>

            <WiredDivider/>

            <WiredFurniturePicker value={furnitureIds} onChange={setFurnitureIds} maxFurniture={20}/>

            <WiredDivider/>

            <WiredFurnitureSource value={furnitureSource} onChange={setFurnitureSource} furnitureIds={furnitureIds} maxFurniture={20}/>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
