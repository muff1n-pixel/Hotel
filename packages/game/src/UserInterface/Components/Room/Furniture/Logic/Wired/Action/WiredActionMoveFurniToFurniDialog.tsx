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
import WiredFurniturePicker from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniturePicker";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function WiredActionMoveFurniToFurniDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [currentFurniPicker, setCurrentFurniPicker] = useState("primary");

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredActionMoveFurniToFurni?.furnitureIds ?? []);
    const [targetFurnitureIds, setTargetFurnitureIds] = useState(data.data.data?.wiredActionMoveFurniToFurni?.targetFurnitureIds ?? []);

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
                
                wiredActionMoveFurniToFurni: {
                    furnitureIds,
                    targetFurnitureIds
                }
            }
        }));

        onClose();
    }, [furnitureIds, targetFurnitureIds, delayInSeconds, data, onClose, room]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredFurniturePicker label={getTranslation("creator.moving_furni")} enabled={currentFurniPicker === "primary"} value={furnitureIds} onChange={setFurnitureIds} maxFurniture={20} grayscale={{
                background: "#FFFFFF",
                foreground: "#82A7F6",
                alpha: 0.8
            }} style={{
                backgroundColor: "#82A7F622",

                marginTop: -5,
                marginBottom: -5,

                paddingTop: 10,
                paddingBottom: 10
            }}>
                <WiredButton onClick={() => setCurrentFurniPicker("primary")} style={{
                    marginTop: "0.5em",
                    padding: "0.15em"
                }}>
                    {getTranslation(currentFurniPicker === "primary" ? "creator.currently_selecting_moving_furni" : "creator.select_moving_furni")}
                </WiredButton>
            </WiredFurniturePicker>

            <WiredDivider/>

            <WiredFurniturePicker label={getTranslation("creator.target_furni")} enabled={currentFurniPicker === "secondary"} value={targetFurnitureIds} onChange={setTargetFurnitureIds} maxFurniture={20} grayscale={{
                background: "#FFFFFF",
                foreground: "#B4D19A",
                alpha: 0.8
            }} style={{
                backgroundColor: "#B4D19A22",

                marginTop: -5,
                marginBottom: -5,

                paddingTop: 10,
                paddingBottom: 10
            }}>
                <WiredButton onClick={() => setCurrentFurniPicker("secondary")} style={{
                    marginTop: "0.5em",
                    padding: "0.15em"
                }}>
                    {getTranslation(currentFurniPicker === "secondary" ? "creator.currently_selecting_target_furni" : "creator.select_target_furni")}
                </WiredButton>
            </WiredFurniturePicker>

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
