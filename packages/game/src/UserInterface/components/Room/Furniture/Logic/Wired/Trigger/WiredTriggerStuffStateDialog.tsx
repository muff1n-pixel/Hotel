import WiredDialog from "../../../../../Dialog/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../Dialog/Wired/WiredFurniture";
import WiredDivider from "../../../../../Dialog/Wired/WiredDivider";
import WiredSection from "../../../../../Dialog/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../Dialog/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredFurniturePicker from "../../../../../Dialog/Wired/WiredFurniturePicker";
import WiredFurnitureSource from "../../../../../Dialog/Wired/WiredFurnitureSource";
import WiredRadio from "../../../../../Dialog/Wired/WiredRadio";
import { useRoomInstance } from "../../../../../../hooks/useRoomInstance";
import { UpdateRoomFurnitureData } from "@pixel63/events";

export type WiredTriggerStuffStateDialog = {
    furniture: RoomInstanceFurniture;
    type: "wf_trg_says_something";
};

export default function WiredTriggerStuffStateDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const [trigger, setTrigger] = useState(data.data.data?.wiredTriggerStuffState?.trigger ?? "all");

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredTriggerStuffState?.selection?.furnitureIds ?? []);
    const [furnitureSource, setFurnitureSource] = useState(data.data.data?.wiredTriggerStuffState?.selection?.furnitureSource ?? "list");

    const handleApply = useCallback(() => {
        if(!room) {
            return;
        }

        const furnitureTriggerStates = furnitureIds.map((furnitureId) => {
            const roomFurniture = room.getFurnitureById(furnitureId);

            return roomFurniture.furniture.animation;
        });

        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                wiredTriggerStuffState: {
                    selection: {
                        furnitureIds,
                        furnitureSource
                    },

                    trigger,
                    furnitureTriggerStates
                }
            }
        }));

        onClose();
    }, [furnitureIds, furnitureSource, trigger, room, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.data}/>

            <WiredDivider/>

            <WiredSection>
                <b>Select options:</b>
                
                <WiredRadio value={trigger} onChange={setTrigger} items={[
                    {
                        value: "all",
                        label: "Trigger for all states"
                    },
                    {
                        value: "state",
                        label: "Trigger for the current state"
                    }
                ]}/>
            </WiredSection>

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
