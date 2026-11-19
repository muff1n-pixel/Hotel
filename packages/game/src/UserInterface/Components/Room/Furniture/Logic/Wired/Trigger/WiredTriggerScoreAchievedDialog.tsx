import { useTranslation } from "react-i18next";
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
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [team, setTeam] = useState(data.data.data?.wiredTriggerScoreAchieved?.team ?? "any");
    const [score, setScore] = useState(data.data.data?.wiredTriggerScoreAchieved?.score ?? 1);

    const handleApply = useCallback(() => {
        if(!room) {
            return;
        }

        room.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
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
                <b>{getTranslation("creator.pick_team")}</b>

                <WiredRadio value={team} onChange={setTeam} items={[
                    {
                        value: "any",
                        label: getTranslation("creator.any_team")
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
                            label: getTranslation("creator.team.red")
                        },
                        {
                            value: "green",
                            label: getTranslation("creator.team.green")
                        },
                        {
                            value: "blue",
                            label: getTranslation("creator.team.blue")
                        },
                        {
                            value: "yellow",
                            label: getTranslation("creator.team.yellow")
                        }
                    ]}/>
                </div>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.team_has_to_score", { score })}</b>

                <WiredSlider value={score} onChange={setScore} min={1} max={1000} />
            </WiredSection>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>{getTranslation("creator.apply")}</WiredButton>
                <WiredButton onClick={onClose}>{getTranslation("creator.cancel")}</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
