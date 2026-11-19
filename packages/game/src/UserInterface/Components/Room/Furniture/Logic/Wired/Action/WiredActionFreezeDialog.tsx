import { useTranslation } from "react-i18next";
import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredDelay from "../../../../../../Common/Dialog/Layouts/Wired/WiredDelay";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import WiredSelection from "@UserInterface/Common/Dialog/Layouts/Wired/Selection/WiredSelection";
import WiredCheckbox from "@UserInterface/Common/Dialog/Layouts/Wired/WiredCheckbox";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function WiredActionFreezeDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [effect, setEffect] = useState(data.data.data?.wiredActionFreeze?.effect ?? "frozen");
    const [unfreezeWhenTeleporting, setUnfreezeWhenTeleporting] = useState(data.data.data?.wiredActionFreeze?.unfreezeWhenTeleporting ?? true);

    const [delayInSeconds, setDelayInSeconds] = useState(data.data.data?.common?.delay?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        room?.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
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
    }, [effect, unfreezeWhenTeleporting, delayInSeconds, data, onClose, room]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>
            
            <WiredSection>
                <b>{getTranslation("creator.pick_an_effect")}</b>

                <WiredSelection value={effect} onChange={setEffect} items={[
                    {
                        value: "frozen",
                        label: getTranslation("creator.frozen")
                    },
                    {
                        value: "x-ray",
                        label: getTranslation("creator.x_ray")
                    },
                    {
                        value: "easterchick",
                        label: getTranslation("creator.easter_chick")
                    },
                    {
                        value: "sandtrap",
                        label: getTranslation("creator.sand_trap")
                    }
                ]}/>

                <WiredCheckbox value={unfreezeWhenTeleporting} onChange={setUnfreezeWhenTeleporting} label={getTranslation("creator.unfreeze_when_teleporting")}/>
            </WiredSection>

            <WiredDivider/>

            <WiredDelay value={delayInSeconds} onChange={setDelayInSeconds}/>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>{getTranslation("creator.apply")}</WiredButton>
                <WiredButton onClick={onClose}>{getTranslation("creator.cancel")}</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
