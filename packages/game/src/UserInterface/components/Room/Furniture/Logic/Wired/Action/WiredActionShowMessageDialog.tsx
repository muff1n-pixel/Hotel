import WiredDialog from "../../../../../Dialog/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../Dialog/Wired/WiredFurniture";
import WiredDivider from "../../../../../Dialog/Wired/WiredDivider";
import WiredSection from "../../../../../Dialog/Wired/WiredSection";
import WiredInput from "../../../../../Dialog/Wired/WiredInput";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../Dialog/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredDelay from "../../../../../Dialog/Wired/WiredDelay";
import { UpdateRoomFurnitureData } from "@pixel63/events";

export type WiredActionShowMessageDialogData = {
    furniture: RoomInstanceFurniture;
    type: "wf_trg_says_something";
};

export default function WiredActionShowMessageDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [message, setMessage] = useState(data.data.data?.wiredActionShowMessage?.message ?? "");
    const [delayInSeconds, setDelayInSeconds] = useState(data.data.data?.wiredActionShowMessage?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                wiredActionShowMessage: {
                    message,
                    delayInSeconds
                }
            }
        }));

        onClose();
    }, [message, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.data}/>

            <WiredDivider/>

            <WiredSection>
                <b>Message:</b>

                <WiredInput placeholder="Enter message..." value={message} onChange={setMessage}/>
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
