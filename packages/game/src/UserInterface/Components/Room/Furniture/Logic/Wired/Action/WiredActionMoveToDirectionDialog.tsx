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
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";
import WiredCheckbox from "@UserInterface/Common/Dialog/Layouts/Wired/WiredCheckbox";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function WiredActionMoveToDirectionDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [startDirection, setStartDirection] = useState(data.data.data?.wiredActionMoveToDirection?.startDirection ?? 0);
    const [blockedDirectionAction, setBlockedDirectionAction] = useState(data.data.data?.wiredActionMoveToDirection?.blockedDirectionAction ?? "wait");
    
    const [blockCollidingWithUsers, setBlockCollidingWithUsers] = useState(data.data.data?.wiredActionMoveToDirection?.blockCollidingWithUsers ?? true);

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredActionMoveToDirection?.furnitureIds ?? []);
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
                
                wiredActionMoveToDirection: {
                    startDirection,
                    blockedDirectionAction,
                    blockCollidingWithUsers,
                    
                    furnitureIds
                }
            }
        }));

        onClose();
    }, [startDirection, blockedDirectionAction, blockCollidingWithUsers, furnitureIds, delayInSeconds, room, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.start_direction")}</b>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: 5
                }}>
                    <WiredRadio value={startDirection} onChange={setStartDirection} items={Array(8).fill(null).map((_, index) => ({
                        value: index,
                        label: (<div className={`sprite_dialog_wired_directions_move_${index}`}/>)
                    }))}/>
                </div>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.when_move_blocked")}</b>

                <WiredRadio value={blockedDirectionAction} onChange={setBlockedDirectionAction} items={[
                    {
                        value: "wait",
                        label: getTranslation("creator.wait")
                    },
                    {
                        value: "right_45_degrees",
                        label: getTranslation("creator.turn_right_45")
                    },
                    {
                        value: "right_90_degrees",
                        label: getTranslation("creator.turn_right_90")
                    },
                    {
                        value: "left_45_degrees",
                        label: getTranslation("creator.turn_left_45")
                    },
                    {
                        value: "left_90_degrees",
                        label: getTranslation("creator.turn_left_90")
                    },
                    {
                        value: "back",
                        label: getTranslation("creator.turn_back")
                    },
                    {
                        value: "random",
                        label: getTranslation("creator.turn_random")
                    },
                ]}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.when_colliding_with_user")}</b>

                <WiredCheckbox value={blockCollidingWithUsers} onChange={setBlockCollidingWithUsers} label={getTranslation("creator.block_furni_movements")}/>
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
