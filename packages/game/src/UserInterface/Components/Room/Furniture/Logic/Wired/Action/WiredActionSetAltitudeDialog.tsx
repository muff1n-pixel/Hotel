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
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import WiredInput from "@UserInterface/Common/Dialog/Layouts/Wired/WiredInput";

export default function WiredActionSetAltitudeDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const [action, setAction] = useState(data.data.data?.wiredActionSetAltitude?.action ?? "increase");
    const [depth, setDepth] = useState(data.data.data?.wiredActionSetAltitude?.depth ?? 0);

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredActionSetAltitude?.furnitureIds ?? []);
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
                
                wiredActionSetAltitude: {
                    action,

                    depth,

                    furnitureIds
                }
            }
        }));

        onClose();
    }, [action, depth, furnitureIds, delayInSeconds, room, data, onClose]);

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
                <FlexLayout direction="row" align="center">
                    <b>Select altitude:</b>

                    <WiredInput value={depth.toString()} onChange={(value) => setDepth(parseFloat(value))} style={{
                        width: 40
                    }}/>
                </FlexLayout>

                <WiredSlider value={depth} onChange={setDepth} min={0} max={80} step={0.1}/>
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
