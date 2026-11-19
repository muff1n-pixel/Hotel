import { useTranslation } from "react-i18next";
import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredFurniturePicker from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniturePicker";
import { useRoomInstance } from "../../../../../../Hooks/useRoomInstance";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import WiredDelay from "@UserInterface/Common/Dialog/Layouts/Wired/WiredDelay";
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";

export default function WiredActionControlClockDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [action, setAction] = useState(data.data.data?.wiredActionControlClock?.action ?? "start");

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredActionControlClock?.furnitureIds ?? []);
    const [delayInSeconds, setDelayInSeconds] = useState(data.data.data?.common?.delay?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        if(!room) {
            return;
        }

        room.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                common: {
                    delay: {
                        delayInSeconds
                    }
                },
                
                wiredActionControlClock: {
                    action,

                    furnitureIds
                }
            }
        }));

        onClose();
    }, [action, furnitureIds, delayInSeconds, room, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.select_option")}</b>

                <WiredRadio value={action} onChange={setAction} items={[
                    {
                        value: "start",
                        label: getTranslation("creator.start")
                    },
                    {
                        value: "stop",
                        label: getTranslation("creator.stop")
                    },
                    {
                        value: "reset",
                        label: getTranslation("creator.reset")
                    },
                    {
                        value: "pause",
                        label: getTranslation("creator.pause")
                    },
                    {
                        value: "resume",
                        label: getTranslation("creator.resume")
                    }
                ]}/>
            </WiredSection>

            <WiredDivider/>

            <WiredFurniturePicker value={furnitureIds} onChange={setFurnitureIds} maxFurniture={20}/>
            
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
