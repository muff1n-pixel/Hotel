import WiredDialog from "../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../..";
import WiredFurniturePicker from "../../../../../Common/Dialog/Layouts/Wired/WiredFurniturePicker";
import WiredFurnitureSource from "../../../../../Common/Dialog/Layouts/Wired/WiredFurnitureSource";
import { UpdateRoomFurnitureData } from "@pixel63/events";

export type WiredFurnitureSelectionDialog = {
    furniture: RoomInstanceFurniture;
    type: "wf_trg_says_something";
};

export default function WiredFurnitureSelectionDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
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
