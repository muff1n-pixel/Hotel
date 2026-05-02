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
import WiredCheckbox from "@UserInterface/Common/Dialog/Layouts/Wired/WiredCheckbox";
import WiredInput from "@UserInterface/Common/Dialog/Layouts/Wired/WiredInput";
import WiredSelection from "@UserInterface/Common/Dialog/Layouts/Wired/Selection/WiredSelection";
import { useTranslation } from "react-i18next";

export default function WiredActionGiveHanditemDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getCarryItemTranslation] = useTranslation("carryitems");
    

    const [giveHanditemUsingBot, setGiveHanditemUsingBot] = useState(data.data.data?.wiredActionGiveHanditem?.giveHanditemUsingBot ?? false);
    const [botName, setBotName] = useState(data.data.data?.wiredActionGiveHanditem?.botName ?? "");

    const [handitem, setHanditem] = useState(data.data.data?.wiredActionGiveHanditem?.handitem ?? 0);

    const [delayInSeconds, setDelayInSeconds] = useState(data.data.data?.common?.delay?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                common: {
                    delay: {
                        delayInSeconds
                    },
                },

                wiredActionGiveHanditem: {
                    giveHanditemUsingBot,
                    botName,

                    handitem
                }
            }
        }));

        onClose();
    }, [giveHanditemUsingBot, botName, handitem, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Bot Name</b>

                <WiredCheckbox value={giveHanditemUsingBot} onChange={setGiveHanditemUsingBot} label="Give hand item using bot"/>

                {(giveHanditemUsingBot) && (
                    <WiredInput value={botName} onChange={setBotName}/>
                )}
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>Hand Item</b>

                <WiredSelection value={handitem} onChange={setHanditem} items={
                    [0, 2, 5, 7, 8, 9, 10, 27 ].map((handitem) => ({
                        value: handitem,
                        label: getCarryItemTranslation(`handitem_${handitem}`)
                    }))
                }/>
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
