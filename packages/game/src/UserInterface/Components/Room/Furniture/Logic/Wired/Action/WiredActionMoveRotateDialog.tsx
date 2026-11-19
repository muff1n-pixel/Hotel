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
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function WiredActionMoveRotateDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [movement, setMovement] = useState(data.data.data?.wiredActionMoveRotate?.movement ?? "none");
    const [rotation, setRotation] = useState(data.data.data?.wiredActionMoveRotate?.rotation ?? "none");

    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.wiredActionMoveRotate?.furnitureIds ?? []);
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
                
                wiredActionMoveRotate: {
                    movement,
                    rotation,
                    
                    furnitureIds
                }
            }
        }));

        onClose();
    }, [movement, rotation, furnitureIds, delayInSeconds, data, onClose, room]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.move_furni")}</b>

                <WiredRadio value={movement} onChange={setMovement} items={[
                    {
                        value: "none",
                        label: getTranslation("creator.no_movement")
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
                <b>{getTranslation("creator.rotate_furni")}</b>

                <WiredRadio value={rotation} onChange={setRotation} items={[
                    {
                        value: "none",
                        label: getTranslation("creator.no_rotation")
                    },
                    {
                        value: "clockwise",
                        label: (<FlexLayout direction="row"><div className="sprite_dialog_wired_rotations_rotate_cw"/> {getTranslation("creator.rotate_clockwise")}</FlexLayout>)
                    },
                    {
                        value: "counter-clockwise",
                        label: (<FlexLayout direction="row"><div className="sprite_dialog_wired_rotations_rotate_ccw"/> {getTranslation("creator.rotate_counter_clockwise")}</FlexLayout>)
                    },
                    {
                        value: "random",
                        label: getTranslation("creator.random_direction")
                    },
                ]}/>
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
