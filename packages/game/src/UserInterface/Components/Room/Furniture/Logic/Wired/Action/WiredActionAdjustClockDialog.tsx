import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredFurniturePicker from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniturePicker";
import { useRoomInstance } from "../../../../../../Hooks/useRoomInstance";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import WiredDelay from "@UserInterface/Common/Dialog/Layouts/Wired/WiredDelay";
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";
import WiredSlider from "@UserInterface/Common/Dialog/Layouts/Wired/Slider/WiredSlider";

export default function WiredActionAdjustClockDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const [action, setAction] = useState(data.data.data?.wiredActionAdjustClock?.action ?? "increase");
    const [minutes, setMinutes] = useState(data.data.data?.wiredActionAdjustClock?.minutes ?? 0);
    const [seconds, setSeconds] = useState(data.data.data?.wiredActionAdjustClock?.seconds ?? 0);

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredActionAdjustClock?.furnitureIds ?? []);
    const [delayInSeconds, setDelayInSeconds] = useState(data.data.data?.common?.delay?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        if(!room) {
            return;
        }

        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                common: {
                    delay: {
                        delayInSeconds
                    }
                },
                
                wiredActionAdjustClock: {
                    action,

                    minutes,
                    seconds,

                    furnitureIds
                }
            }
        }));

        onClose();
    }, [action, minutes, seconds, furnitureIds, delayInSeconds, room, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Select option</b>

                <WiredRadio value={action} onChange={setAction} items={[
                    {
                        value: "increase",
                        label: "Increase"
                    },
                    {
                        value: "decrease",
                        label: "Decrease"
                    },
                    {
                        value: "value",
                        label: "Set value"
                    }
                ]}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{minutes} {(minutes === 1)?("minute"):("minutes")}</b>

                <WiredSlider value={minutes} onChange={setMinutes} min={0} max={60}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{seconds} {(seconds === 1)?("second"):("seconds")}</b>

                <WiredSlider value={seconds} onChange={setSeconds} min={0} max={60}/>
            </WiredSection>

            <WiredDivider/>

            <WiredFurniturePicker value={furnitureIds} onChange={setFurnitureIds} maxFurniture={20}/>
            
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
