import { useCallback, useState } from "react";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import RoomFurnitureDimmerDialogColors from "./RoomFurnitureDimmerDialogColors";
import DimmerDialogSlider from "../../../../../Common/Dialog/Layouts/Dimmer/Components/DimmerDialogSlider";
import DimmerDialogCheckbox from "../../../../../Common/Dialog/Layouts/Dimmer/Components/DimmerDialogCheckbox";
import DimmerDialogButton from "../../../../../Common/Dialog/Layouts/Dimmer/Components/DimmerDialogButton";
import { webSocketClient } from "../../../../../..";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import DimmerDialog from "@UserInterface/Common/Dialog/Layouts/Dimmer/DimmerDialog";

export default function RoomFurnitureDimmerDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const [enabled, setEnabled] = useState(data.data.data?.moodlight?.enabled ?? false);
    const [color, setColor] = useState(data.data.data?.moodlight?.color ?? "#FF3333");
    const [alpha, setAlpha] = useState(data.data.data?.moodlight?.alpha ?? 128);
    const [backgroundOnly, setBackgroundOnly] = useState(data.data.data?.moodlight?.backgroundOnly ?? false);

    const handleToggle = useCallback(() => {
        setEnabled(!enabled);

        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                moodlight: {
                    enabled: !enabled,
                    color,
                    alpha,
                    backgroundOnly
                }
            }
        }));
    }, [enabled]);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                moodlight: {
                    enabled,
                    color,
                    alpha,
                    backgroundOnly
                }
            }
        }));
    }, [enabled, color, alpha, backgroundOnly]);

    if(hidden) {
        return null;
    }

    return (
        <DimmerDialog title="Room dimmer" onClose={onClose}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 10
            }}>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    justifyContent: "space-evenly"
                }}>
                    <RoomFurnitureDimmerDialogColors value={color} onChange={setColor}/>

                    <div>
                        <DimmerDialogSlider value={alpha} onChange={setAlpha}/>
                    </div>
                </div>

                <div style={{
                    width: 60,
                    height: 86,

                    border: "2px solid #00ED1F",
                    borderRadius: 3,

                    background: "rgba(0, 0, 0, .2)"
                }}>

                </div>
            </div>

            <DimmerDialogCheckbox value={backgroundOnly} onChange={setBackgroundOnly} label="Background only"/>

            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 10
            }}>
                <div style={{ flex: 1 }}>
                    <DimmerDialogButton label={(enabled)?("Turn off"):("Turn on")} onClick={handleToggle}/>
                </div>
                
                <div style={{ flex: 1 }}>
                    <DimmerDialogButton label="Apply" onClick={handleApply}/>
                </div>
            </div>
        </DimmerDialog>
    );
}
