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
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import WiredInput from "@UserInterface/Common/Dialog/Layouts/Wired/WiredInput";
import WiredSlider from "@UserInterface/Common/Dialog/Layouts/Wired/Slider/WiredSlider";
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function WiredActionGiveScoreTeamDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [score, setScore] = useState(data.data.data?.wiredActionGiveScoreTeam?.score ?? 0);
    const [action, setAction] = useState(data.data.data?.wiredActionGiveScoreTeam?.action ?? "add");
    
    const [game, setGame] = useState(data.data.data?.wiredActionGiveScoreTeam?.game ?? "wired");
    const [team, setTeam] = useState(data.data.data?.wiredActionGiveScoreTeam?.team ?? "red");

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

                wiredActionGiveScoreTeam: {
                    score,
                    action,

                    game,
                    team
                }
            }
        }));

        onClose();
    }, [score, action, game, team, delayInSeconds, data, onClose, room]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>
            
            <WiredSection>
                <b>{getTranslation("creator.pick_team")}</b>

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
                <b>{getTranslation("creator.choose_game")}</b>

                <WiredRadio value={game} onChange={setGame} items={[
                    {
                        value: "wired",
                        label: getTranslation("creator.games.wired")
                    },
                    {
                        value: "battle_banzai",
                        label: getTranslation("creator.games.battle_banzai")
                    },
                    {
                        value: "freeze",
                        label: getTranslation("creator.games.freeze")
                    }
                ]}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <FlexLayout direction="row" align="center">
                    <b>{getTranslation("creator.set_points")}</b>

                    <WiredInput value={score.toString()} onChange={(value) => setScore(parseInt(value))} style={{
                        width: 40
                    }}/>
                </FlexLayout>

                <WiredSlider value={score} onChange={setScore} min={0} max={1000}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.type_of_effect")}</b>

                <WiredRadio value={action} onChange={setAction} items={[
                    {
                        value: "add",
                        label: getTranslation("creator.add_points")
                    },
                    {
                        value: "remove",
                        label: getTranslation("creator.remove_points")
                    }
                ]}/>
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
