import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import { useRoomInstance } from "../../../../../../Hooks/useRoomInstance";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import WiredSlider from "@UserInterface/Common/Dialog/Layouts/Wired/Slider/WiredSlider";

export default function WiredTriggerAtGivenTimeDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const [seconds, setSeconds] = useState(data.data.data?.wiredTriggerAtSetTime?.seconds ?? 1);

    const handleApply = useCallback(() => {
        if(!room) {
            return;
        }

        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                wiredTriggerAtSetTime: {
                    seconds
                }
            }
        }));

        onClose();
    }, [seconds, room, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Set time: {seconds} {((seconds === 1)?("second"):("seconds"))}</b>

                <WiredSlider value={seconds} onChange={setSeconds} min={1} max={600} />
            </WiredSection>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
