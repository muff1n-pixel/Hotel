import { useCallback, useState } from "react";
import useDialogMovement from "../../../../Dialog/Hooks/useDialogMovement";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import RoomFurnitureDimmerDialogColors from "./RoomFurnitureDimmerDialogColors";
import DimmerDialogSlider from "../../../../Dialog/Dimmer/DimmerDialogSlider";
import DimmerDialogCheckbox from "../../../../Dialog/Dimmer/DimmerDialogCheckbox";
import DimmerDialogButton from "../../../../Dialog/Dimmer/DimmerDialogButton";
import { webSocketClient } from "../../../../../..";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { UpdateRoomFurnitureData } from "@pixel63/events";

export type RoomFurnitureDimmerData = {
    furniture: RoomInstanceFurniture;
    type: "furniture_roomdimmer";
};

export default function RoomFurnitureDimmerDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const { elementRef, onDialogFocus, onMouseDown } = useDialogMovement();

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
        <div ref={elementRef} onMouseDown={onDialogFocus} className="sprite_dialog_roomdimmer_background" style={{
            position: "fixed",
            pointerEvents: "auto"
        }}>
            <div style={{
                position: "absolute",
                
                left: 0,
                top: 0,

                height: 25,
                width: "100%",

                display: "flex",
                alignItems: "center",

                paddingLeft: 35,
                paddingBottom: 2,

                boxSizing: "border-box"
            }} onMouseDown={onMouseDown}>
                <div style={{
                    fontSize: 12,
                    pointerEvents: "none",
                    color: "#7F5D0B"
                }}>
                    <b>Room dimmer</b>
                </div>

                <div className="sprite_dialog_roomdimmer_close" style={{
                    position: "absolute",

                    top: 7,
                    right: 13,

                    cursor: "pointer"
                }} onClick={onClose}/>
            </div>

            <div style={{
                position: "absolute",

                width: 246,
                height: 171,

                left: 25,
                top: 25,

                padding: "6px 12px",
                boxSizing: "border-box",

                color: "#00ED1F",
                fontSize: 12,

                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",

                gap: 10
            }}>
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
            </div>
        </div>
    );
}
