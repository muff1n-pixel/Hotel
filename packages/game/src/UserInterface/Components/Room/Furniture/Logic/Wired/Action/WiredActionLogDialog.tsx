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
import WiredInput from "@UserInterface/Common/Dialog/Layouts/Wired/WiredInput";
import WiredSelection from "@UserInterface/Common/Dialog/Layouts/Wired/Selection/WiredSelection";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function WiredActionLogDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [level, setLevel] = useState(data.data.data?.wiredActionLog?.level ?? "INFO");
    const [message, setMessage] = useState(data.data.data?.wiredActionLog?.message ?? "");

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

                wiredActionLog: {
                    level,
                    message
                }
            }
        }));

        onClose();
    }, [level, message, delayInSeconds, data, onClose, room]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.log_level")}</b>

                <WiredSelection
                    value={level}
                    onChange={setLevel}
                    items={[
                        {
                            value: "INFO",
                            label: getTranslation("monitor.levels.info")
                        },
                        {
                            value: "WARNING",
                            label: getTranslation("monitor.levels.warning")
                        },
                        {
                            value: "ERROR",
                            label: getTranslation("monitor.levels.error")
                        }
                    ]}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.message")}</b>

                <WiredInput value={message} onChange={setMessage}/>
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
