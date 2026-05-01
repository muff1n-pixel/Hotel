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

export default function WiredActionMoveFurniToFurniDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [currentFurniPicker, setCurrentFurniPicker] = useState("primary");

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredActionMoveFurniToFurni?.furnitureIds ?? []);
    const [targetFurnitureIds, setTargetFurnitureIds] = useState(data.data.data?.wiredActionMoveFurniToFurni?.targetFurnitureIds ?? []);

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
                
                wiredActionMoveFurniToFurni: {
                    furnitureIds,
                    targetFurnitureIds
                }
            }
        }));

        onClose();
    }, [furnitureIds, targetFurnitureIds, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredFurniturePicker label="The moving furni" enabled={currentFurniPicker === "primary"} value={furnitureIds} onChange={setFurnitureIds} maxFurniture={20} grayscale={{
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
                    {(currentFurniPicker === "primary")?("Currently selecting"):("Select")} moving furni
                </WiredButton>
            </WiredFurniturePicker>

            <WiredDivider/>

            <WiredFurniturePicker label="The target furni" enabled={currentFurniPicker === "secondary"} value={targetFurnitureIds} onChange={setTargetFurnitureIds} maxFurniture={20} grayscale={{
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
                    {(currentFurniPicker === "secondary")?("Currently selecting"):("Select")} target furni
                </WiredButton>
            </WiredFurniturePicker>

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
