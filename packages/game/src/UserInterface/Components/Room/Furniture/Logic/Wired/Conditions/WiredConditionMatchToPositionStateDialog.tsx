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
import WiredFurniturePicker from "@UserInterface/Common/Dialog/Layouts/Wired/WiredFurniturePicker";
import WiredCheckbox from "@UserInterface/Common/Dialog/Layouts/Wired/WiredCheckbox";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function WiredConditionMatchToPositionStateDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const [matchState, setMatchState] = useState(data.data.data?.common?.furnitureState?.matchState ?? false);
    const [matchDirection, setMatchDirection] = useState(data.data.data?.common?.furnitureState?.matchDirection ?? false);
    const [matchPosition, setMatchPosition] = useState(data.data.data?.common?.furnitureState?.matchPosition ?? false);
    const [matchAltitude, setMatchAltitude] = useState(data.data.data?.common?.furnitureState?.matchAltitude ?? false);

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.common?.furnitureState?.furniture.map((furniture) => furniture.furnitureId) ?? []);

    const handleApply = useCallback(() => {
        if(!room) {
            return;
        }

        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                common: {
                    furnitureState: {
                        matchState,
                        matchDirection,
                        matchPosition,
                        matchAltitude,
                        
                        furniture: furnitureIds.map((furnitureId) => {
                            const furniture = room.getFurnitureById(furnitureId);

                            return {
                                furnitureId,

                                animation: furniture.data.animation,
                                direction: furniture.data.direction,
                                position: furniture.item.position,
                            };
                        })
                    }
                },
            }
        }));

        onClose();
    }, [matchState, matchDirection, matchPosition, matchAltitude, furnitureIds, room, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Furni states to match:</b>

                <WiredCheckbox value={matchState} onChange={setMatchState} label="Current furni state"/>
                <WiredCheckbox value={matchDirection} onChange={setMatchDirection} label="Current direction"/>
                <WiredCheckbox value={matchPosition} onChange={setMatchPosition} label="Current position in room"/>
                <WiredCheckbox value={matchAltitude} onChange={setMatchAltitude} label="Current altitude"/>
            </WiredSection>

            <WiredDivider/>
            
            <WiredFurniturePicker value={furnitureIds} onChange={setFurnitureIds} maxFurniture={20}/>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
