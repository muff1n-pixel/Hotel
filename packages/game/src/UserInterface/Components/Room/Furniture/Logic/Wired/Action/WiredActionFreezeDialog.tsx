import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredDelay from "../../../../../../Common/Dialog/Layouts/Wired/WiredDelay";
import WiredFurniturePicker from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniturePicker";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import WiredSelection from "@UserInterface/Common/Dialog/Layouts/Wired/Selection/WiredSelection";
import WiredCheckbox from "@UserInterface/Common/Dialog/Layouts/Wired/WiredCheckbox";

export default function WiredActionFreezeDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [effect, setEffect] = useState(data.data.data?.wiredActionFreeze?.effect ?? "frozen");
    const [unfreezeWhenTeleporting, setUnfreezeWhenTeleporting] = useState(data.data.data?.wiredActionFreeze?.unfreezeWhenTeleporting ?? true);

    const [delayInSeconds, setDelayInSeconds] = useState(data.data.data?.common?.delay?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                common: {
                    delay: {
                        delayInSeconds
                    }
                },

                wiredActionFreeze: {
                    effect,
                    unfreezeWhenTeleporting
                }
            }
        }));

        onClose();
    }, [effect, unfreezeWhenTeleporting, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>
            
            <WiredSection>
                <b>Pick an effect:</b>

                <WiredSelection value={effect} onChange={setEffect} items={[
                    {
                        value: "frozen",
                        label: "Frozen"
                    },
                    {
                        value: "x-ray",
                        label: "X-Ray"
                    },
                    {
                        value: "easterchick",
                        label: "Easter Chick"
                    },
                    {
                        value: "sandtrap",
                        label: "Sand trap"
                    }
                ]}/>

                <WiredCheckbox value={unfreezeWhenTeleporting} onChange={setUnfreezeWhenTeleporting} label="Unfreeze when teleporting"/>
            </WiredSection>

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
