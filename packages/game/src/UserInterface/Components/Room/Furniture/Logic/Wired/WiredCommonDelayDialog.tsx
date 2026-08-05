import WiredDialog from "../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../..";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import WiredDelay from "@UserInterface/Common/Dialog/Layouts/Wired/WiredDelay";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function WiredCommonDelayDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

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
            }
        }));

        onClose();
    }, [delayInSeconds, data, onClose, room]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

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
