import WiredDialog from "../../../../../Dialog/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../Dialog/Wired/WiredFurniture";
import WiredDivider from "../../../../../Dialog/Wired/WiredDivider";
import WiredSection from "../../../../../Dialog/Wired/WiredSection";
import WiredInput from "../../../../../Dialog/Wired/WiredInput";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../Dialog/Wired/WiredButton";
import { WiredActionShowMessageData } from "@Shared/Interfaces/Room/Furniture/Wired/Action/WiredActionShowMessageData";
import { webSocketClient } from "../../../../../../..";
import { SetFurnitureDataEventData } from "@Shared/Communications/Requests/Rooms/Furniture/SetFurnitureDataEventData";

export type WiredActionShowMessageDialogData = {
    furniture: RoomInstanceFurniture<WiredActionShowMessageData>;
    type: "wf_trg_says_something";
};

export default function WiredActionShowMessageDialog({ data, onClose }: RoomFurnitureLogicDialogProps<WiredActionShowMessageDialogData>) {
    const [message, setMessage] = useState(data.furniture.data.data?.message ?? "");
    const [delayInSeconds, setDelayInSeconds] = useState(data.furniture.data.data?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        webSocketClient.send<SetFurnitureDataEventData<WiredActionShowMessageData>>("SetFurnitureDataEvent", {
            furnitureId: data.furniture.data.id,
            data: {
                message,
                delayInSeconds
            }
        });

        onClose();
    }, [message, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furniture.data}/>

            <WiredDivider/>

            <WiredSection>
                <b>Message:</b>

                <WiredInput placeholder="Enter message..." value={message} onChange={setMessage}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>Delay effect for {delayInSeconds} seconds</b>

                <WiredInput placeholder="0" value={delayInSeconds.toString()} onChange={(value) => setDelayInSeconds(parseInt(value))}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
