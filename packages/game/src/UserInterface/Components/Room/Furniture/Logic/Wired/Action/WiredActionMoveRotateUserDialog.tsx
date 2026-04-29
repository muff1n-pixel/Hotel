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

export default function WiredActionMoveRotateUserDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [movement, setMovement] = useState(data.data.data?.wiredActionMoveRotateUser?.movement ?? "none");
    const [rotation, setRotation] = useState(data.data.data?.wiredActionMoveRotateUser?.rotation ?? "none");

    const [delayInSeconds, setDelayInSeconds] = useState(data.data.data?.wiredActionMoveRotateUser?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                wiredActionMoveRotateUser: {
                    movement,
                    rotation,
                    
                    delayInSeconds
                }
            }
        }));

        onClose();
    }, [movement, rotation, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Move user:</b>

                <WiredRadio value={movement} onChange={setMovement} items={[
                    {
                        value: "none",
                        label: "No movement"
                    }
                ]}/>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: 5
                }}>
                    <WiredRadio value={movement} onChange={setMovement} items={Array(8).fill(null).map((_, index) => ({
                        value: index.toString(),
                        label: (<div className={`sprite_dialog_wired_directions_move_${index}`}/>)
                    }))}/>
                </div>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>Rotate user:</b>

                <WiredRadio value={rotation} onChange={setRotation} items={[
                    {
                        value: "none",
                        label: "No rotation"
                    }
                ]}/>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: 5
                }}>
                    <WiredRadio value={rotation} onChange={setRotation} items={Array(8).fill(null).map((_, index) => ({
                        value: index.toString(),
                        label: (<div className={`sprite_dialog_wired_directions_move_${index}`}/>)
                    })).concat([
                        {
                            value: "clockwise",
                            label: (<div className="sprite_dialog_wired_rotations_rotate_cw"/>)
                        },
                        {
                            value: "counter-clockwise",
                            label: (<div className="sprite_dialog_wired_rotations_rotate_ccw"/>)
                        }
                    ])}/>
                </div>
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
