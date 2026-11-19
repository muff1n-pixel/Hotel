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
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function WiredActionJoinTeamDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [team, setTeam] = useState(data.data.data?.wiredActionJoinTeam?.team ?? "red");
    const [game, setGame] = useState(data.data.data?.wiredActionJoinTeam?.game ?? "wired");

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

                wiredActionJoinTeam: {
                    team,
                    game
                }
            }
        }));

        onClose();
    }, [team, game, delayInSeconds, data, onClose, room]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

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

            <WiredDelay value={delayInSeconds} onChange={setDelayInSeconds}/>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>{getTranslation("creator.apply")}</WiredButton>
                <WiredButton onClick={onClose}>{getTranslation("creator.cancel")}</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
