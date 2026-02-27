import WiredDialog from "../../../../../Dialog/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../Dialog/Wired/WiredFurniture";
import WiredDivider from "../../../../../Dialog/Wired/WiredDivider";
import WiredSection from "../../../../../Dialog/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../Dialog/Wired/WiredButton";
import { WiredFurnitureSelectionData } from "@Shared/Interfaces/Room/Furniture/Wired/WiredFurnitureSelectionData";
import { webSocketClient } from "../../../../../../..";
import { SetFurnitureDataEventData } from "@Shared/Communications/Requests/Rooms/Furniture/SetFurnitureDataEventData";
import WiredFurniturePicker from "../../../../../Dialog/Wired/WiredFurniturePicker";
import WiredFurnitureSource from "../../../../../Dialog/Wired/WiredFurnitureSource";

export type WiredTriggerReceiveSignalDialog = {
    furniture: RoomInstanceFurniture<WiredFurnitureSelectionData>;
    type: "wf_trg_says_something";
};

export default function WiredTriggerReceiveSignalDialog({ data, onClose }: RoomFurnitureLogicDialogProps<WiredTriggerReceiveSignalDialog>) {
    const [furnitureIds, setFurnitureIds] = useState(data.furniture.data.data?.furnitureIds ?? []);
    const [furnitureSource, setFurnitureSource] = useState(data.furniture.data.data?.furnitureSource ?? "list");

    const handleApply = useCallback(() => {
        webSocketClient.send<SetFurnitureDataEventData<WiredFurnitureSelectionData>>("SetFurnitureDataEvent", {
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

            <WiredFurniturePicker value={furnitureIds} onChange={setFurnitureIds} maxFurniture={20} restrictedToFurnitureTypes={["wf_antenna1", "wf_antenna2"]}/>

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
