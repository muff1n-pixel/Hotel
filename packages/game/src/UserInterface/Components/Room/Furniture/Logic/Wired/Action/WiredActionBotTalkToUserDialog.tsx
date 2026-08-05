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
import WiredInput from "@UserInterface/Common/Dialog/Layouts/Wired/WiredInput";
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function WiredActionBotTalkToUserDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const [botName, setBotName] = useState(data.data.data?.wiredActionBotTalkToUser?.botName ?? "");
    const [message, setMessage] = useState(data.data.data?.wiredActionBotTalkToUser?.message ?? "");
    const [whisper, setWhisper] = useState(data.data.data?.wiredActionBotTalkToUser?.whisper ?? false);

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

                wiredActionBotTalkToUser: {
                    botName,
                    message,
                    whisper
                }
            }
        }));

        onClose();
    }, [botName, message, whisper, delayInSeconds, data, onClose, room]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Bot Name</b>

                <WiredInput value={botName} onChange={setBotName}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>Message</b>

                <WiredInput value={message} onChange={setMessage}/>

                <WiredRadio value={whisper} onChange={setWhisper} items={[
                    {
                        value: false,
                        label: "Talk"
                    },
                    {
                        value: true,
                        label: "Whisper"
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
