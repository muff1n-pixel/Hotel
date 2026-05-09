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
import WiredSelection from "@UserInterface/Common/Dialog/Layouts/Wired/Selection/WiredSelection";

export default function WiredActionLogDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [level, setLevel] = useState(data.data.data?.wiredActionLog?.level ?? "INFO");
    const [message, setMessage] = useState(data.data.data?.wiredActionLog?.message ?? "");

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

                wiredActionLog: {
                    level,
                    message
                }
            }
        }));

        onClose();
    }, [level, message, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Log level</b>

                <WiredSelection
                    value={level}
                    onChange={setLevel}
                    items={[
                        {
                            value: "INFO",
                            label: "INFO"
                        },
                        {
                            value: "WARNING",
                            label: "WARNING"
                        },
                        {
                            value: "ERROR",
                            label: "ERROR"
                        }
                    ]}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>Message</b>

                <WiredInput value={message} onChange={setMessage}/>
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
