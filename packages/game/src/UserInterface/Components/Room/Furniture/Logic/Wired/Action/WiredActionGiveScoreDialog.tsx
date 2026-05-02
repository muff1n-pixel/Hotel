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
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import WiredInput from "@UserInterface/Common/Dialog/Layouts/Wired/WiredInput";
import WiredSlider from "@UserInterface/Common/Dialog/Layouts/Wired/Slider/WiredSlider";
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";

export default function WiredActionGiveScoreDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [score, setScore] = useState(data.data.data?.wiredActionGiveScore?.score ?? 0);
    const [action, setAction] = useState(data.data.data?.wiredActionGiveScore?.action ?? "add");

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

                wiredActionGiveScore: {
                    score,
                    action
                }
            }
        }));

        onClose();
    }, [score, action, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <FlexLayout direction="row" align="center">
                    <b>Set the points:</b>

                    <WiredInput value={score.toString()} onChange={(value) => setScore(parseInt(value))} style={{
                        width: 40
                    }}/>
                </FlexLayout>

                <WiredSlider value={score} onChange={setScore} min={0} max={1000}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>Type of effect:</b>

                <WiredRadio value={action} onChange={setAction} items={[
                    {
                        value: "add",
                        label: "Add points"
                    },
                    {
                        value: "remove",
                        label: "Remove points"
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
