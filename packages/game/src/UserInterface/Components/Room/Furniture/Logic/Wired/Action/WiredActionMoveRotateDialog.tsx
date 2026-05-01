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

export default function WiredActionMoveRotateDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [movement, setMovement] = useState(data.data.data?.wiredActionMoveRotate?.movement ?? "none");
    const [rotation, setRotation] = useState(data.data.data?.wiredActionMoveRotate?.rotation ?? "none");

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredActionMoveRotate?.furnitureIds ?? []);
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
                
                wiredActionMoveRotate: {
                    movement,
                    rotation,
                    
                    furnitureIds
                }
            }
        }));

        onClose();
    }, [movement, rotation, furnitureIds, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Move furni:</b>

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
                    })).concat([
                        {
                            value: "diagonal",
                            label: (<div className="sprite_dialog_wired_directions_move_diag"/>)
                        },
                        {
                            value: "vertical",
                            label: (<div className="sprite_dialog_wired_directions_move_vrt"/>)
                        },
                        {
                            value: "random",
                            label: (<div className="sprite_dialog_wired_directions_move_rnd"/>)
                        }
                    ])}/>
                </div>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>Rotate furni:</b>

                <WiredRadio value={rotation} onChange={setRotation} items={[
                    {
                        value: "none",
                        label: "No rotation"
                    },
                    {
                        value: "clockwise",
                        label: (<FlexLayout direction="row"><div className="sprite_dialog_wired_rotations_rotate_cw"/> Rotate clockwise</FlexLayout>)
                    },
                    {
                        value: "counter-clockwise",
                        label: (<FlexLayout direction="row"><div className="sprite_dialog_wired_rotations_rotate_ccw"/> Rotate counter clockwise</FlexLayout>)
                    },
                    {
                        value: "random",
                        label: "To random direction"
                    },
                ]}/>
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
