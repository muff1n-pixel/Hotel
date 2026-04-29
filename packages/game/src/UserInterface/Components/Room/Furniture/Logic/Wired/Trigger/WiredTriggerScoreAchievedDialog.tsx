import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import { useRoomInstance } from "../../../../../../Hooks/useRoomInstance";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import WiredSlider from "@UserInterface/Common/Dialog/Layouts/Wired/Slider/WiredSlider";
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";

export default function WiredTriggerScoreAchievedDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const [team, setTeam] = useState(data.data.data?.wiredTriggerScoreAchieved?.team ?? "any");
    const [score, setScore] = useState(data.data.data?.wiredTriggerScoreAchieved?.score ?? 1);

    const handleApply = useCallback(() => {
        if(!room) {
            return;
        }

        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                wiredTriggerScoreAchieved: {
                    team,
                    score
                }
            }
        }));

        onClose();
    }, [team, score, room, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Pick team</b>

                <WiredRadio value={team} onChange={setTeam} items={[
                    {
                        value: "any",
                        label: "Any team"
                    }
                ]}/>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 5
                }}>
                    <WiredRadio value={team} onChange={setTeam} items={[
                        {
                            value: "red",
                            label: "Red"
                        },
                        {
                            value: "green",
                            label: "Green"
                        },
                        {
                            value: "blue",
                            label: "Blue"
                        },
                        {
                            value: "yellow",
                            label: "Yellow"
                        }
                    ]}/>
                </div>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>Team has to score: {score}</b>

                <WiredSlider value={score} onChange={setScore} min={1} max={1000} />
            </WiredSection>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
