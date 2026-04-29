import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredFurniturePicker from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniturePicker";
import WiredFurnitureSource from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurnitureSource";
import WiredRadio from "../../../../../../Common/Dialog/Layouts/Wired/WiredRadio";
import { useRoomInstance } from "../../../../../../Hooks2/useRoomInstance";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import WiredSlider from "@UserInterface/Common/Dialog/Layouts/Wired/Slider/WiredSlider";

export type WiredTriggerClockCounterDialog = {
    furniture: RoomInstanceFurniture;
    type: "wf_trg_clock_counter";
};

export default function WiredTriggerClockCounterDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const [minute, setMinute] = useState(data.data.data?.wiredTriggerClockCounter?.minute ?? 0);
    const [second, setSecond] = useState(data.data.data?.wiredTriggerClockCounter?.second ?? 0);

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredTriggerClockCounter?.selection?.furnitureIds ?? []);
    const [furnitureSource, setFurnitureSource] = useState(data.data.data?.wiredTriggerClockCounter?.selection?.furnitureSource ?? "list");

    const handleApply = useCallback(() => {
        if(!room) {
            return;
        }

        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                wiredTriggerClockCounter: {
                    minute,
                    second,

                    selection: {
                        furnitureIds,
                        furnitureSource
                    }
                }
            }
        }));

        onClose();
    }, [furnitureIds, furnitureSource, minute, second, room, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>{minute} {((minute === 1)?("minute"):("minutes"))} elapsed</b>
                
                <WiredSlider value={minute} onChange={setMinute} min={0} max={59} />
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{second} {((second === 1)?("second"):("seconds"))} elapsed</b>

                <WiredSlider value={second} onChange={setSecond} min={0} max={59} />
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
