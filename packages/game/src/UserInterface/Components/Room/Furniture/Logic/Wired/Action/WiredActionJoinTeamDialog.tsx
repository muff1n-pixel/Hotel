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
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";

export default function WiredActionJoinTeamDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [team, setTeam] = useState(data.data.data?.wiredActionJoinTeam?.team ?? "red");
    const [game, setGame] = useState(data.data.data?.wiredActionJoinTeam?.game ?? "wired");

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

                wiredActionJoinTeam: {
                    team,
                    game
                }
            }
        }));

        onClose();
    }, [team, game, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Pick team</b>

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
                <b>Choose game</b>

                <WiredRadio value={game} onChange={setGame} items={[
                    {
                        value: "wired",
                        label: "Wired"
                    },
                    {
                        value: "battle_banzai",
                        label: "Battle Banzai"
                    },
                    {
                        value: "freeze",
                        label: "Freeze"
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
