import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredSlider from "../../../../../../Common/Dialog/Layouts/Wired/Slider/WiredSlider";
import { UpdateRoomFurnitureData } from "@pixel63/events";

export type WiredTriggerPeriodicallyShortDialog = {
    furniture: RoomInstanceFurniture;
    type: "wf_trg_says_something";
};

export default function WiredTriggerPeriodicallyShortDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [seconds, setSeconds] = useState(data.data.data?.wiredTriggerPeriodically?.seconds ?? 5);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,
            data: {
                wiredTriggerPeriodically: {
                    seconds
                }
            }
        }));

        onClose();
    }, [seconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.data}/>

            <WiredDivider/>

            <WiredSection>
                <b>Set the time: {seconds * 1000} milliseconds</b>

                <WiredSlider value={seconds * 1000} onChange={(value) => setSeconds(value / 1000)} min={100} max={1000} step={100}/>

                <div style={{ fontSize: 11 }}><i>Currently limited to 500 millisecond intervals.</i></div>
            </WiredSection>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
