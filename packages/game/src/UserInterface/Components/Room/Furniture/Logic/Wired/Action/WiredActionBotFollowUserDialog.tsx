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
import WiredFurniturePicker from "@UserInterface/Common/Dialog/Layouts/Wired/WiredFurniturePicker";
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";

export default function WiredActionBotFollowUserDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [botName, setBotName] = useState(data.data.data?.wiredActionBotFollowUser?.botName ?? "");
    const [stopFollowing, setStopFollowing] = useState(data.data.data?.wiredActionBotFollowUser?.stopFollowing ?? false);

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

                wiredActionBotFollowUser: {
                    botName,
                    stopFollowing
                }
            }
        }));

        onClose();
    }, [botName, stopFollowing, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Bot Name</b>

                <WiredInput value={botName} onChange={setBotName}/>

                <WiredRadio value={stopFollowing} onChange={setStopFollowing} items={[
                    {
                        value: false,
                        label: "Start Following"
                    },
                    {
                        value: true,
                        label: "Stop Following"
                    }
                ]}/>
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
