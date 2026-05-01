import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
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
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import WiredCheckbox from "@UserInterface/Common/Dialog/Layouts/Wired/WiredCheckbox";

export default function WiredActionMoveToDirectionDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [startDirection, setStartDirection] = useState(data.data.data?.wiredActionMoveToDirection?.startDirection ?? 0);
    const [blockedDirectionAction, setBlockedDirectionAction] = useState(data.data.data?.wiredActionMoveToDirection?.blockedDirectionAction ?? "wait");
    
    const [blockCollidingWithUsers, setBlockCollidingWithUsers] = useState(data.data.data?.wiredActionMoveToDirection?.blockCollidingWithUsers ?? true);

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredActionMoveToDirection?.furnitureIds ?? []);
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
                
                wiredActionMoveToDirection: {
                    startDirection,
                    blockedDirectionAction,
                    blockCollidingWithUsers,
                    
                    furnitureIds
                }
            }
        }));

        onClose();
    }, [startDirection, blockedDirectionAction, blockCollidingWithUsers, furnitureIds, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Start direction</b>

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
                <b>When move is blocked</b>

                <WiredRadio value={blockedDirectionAction} onChange={setBlockedDirectionAction} items={[
                    {
                        value: "wait",
                        label: "Wait"
                    },
                    {
                        value: "right_45_degrees",
                        label: "Turn right 45 degrees"
                    },
                    {
                        value: "right_90_degrees",
                        label: "Turn right 90 degrees"
                    },
                    {
                        value: "left_45_degrees",
                        label: "Turn left 45 degrees"
                    },
                    {
                        value: "left_90_degrees",
                        label: "Turn left 90 degrees"
                    },
                    {
                        value: "back",
                        label: "Turn back"
                    },
                    {
                        value: "random",
                        label: "Turn to a random direction"
                    },
                ]}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>When colliding with user</b>

                <WiredCheckbox value={blockCollidingWithUsers} onChange={setBlockCollidingWithUsers} label="Block furni movements"/>
            </WiredSection>

            <WiredDivider/>

            <WiredFurniturePicker value={furnitureIds} onChange={setFurnitureIds} maxFurniture={20}/>

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
