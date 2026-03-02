import WiredDialog from "../../../../Dialog/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../Dialog/Wired/WiredFurniture";
import WiredDivider from "../../../../Dialog/Wired/WiredDivider";
import WiredSection from "../../../../Dialog/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../Dialog/Wired/WiredButton";
import { webSocketClient } from "../../../../../..";
import WiredFurniturePicker from "../../../../Dialog/Wired/WiredFurniturePicker";
import WiredFurnitureSource from "../../../../Dialog/Wired/WiredFurnitureSource";
import { UpdateRoomFurnitureData } from "@pixel63/events";

export type WiredTriggerSignalDialogDialog = {
    furniture: RoomInstanceFurniture;
    type: "wf_trg_says_something";
};

export default function WiredSignalDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredFurnitureSelection?.furnitureIds ?? []);
    const [furnitureSource, setFurnitureSource] = useState(data.data.data?.wiredFurnitureSelection?.furnitureSource ?? "list");

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,
            data: {
                wiredFurnitureSelection: {
                    furnitureIds,
                    furnitureSource
                }
            }
        }));

        onClose();
    }, [furnitureIds, furnitureSource, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.data}/>

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
