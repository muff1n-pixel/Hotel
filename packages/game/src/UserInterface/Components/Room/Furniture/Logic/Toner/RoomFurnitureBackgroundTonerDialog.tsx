import { useCallback, useState } from "react";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import { webSocketClient } from "../../../../../..";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import Dialog from "../../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../../../Common/Dialog/Components/Button/DialogButton";
import DialogColorPicker from "../../../../../Common/Dialog/Components/ColorPicker/DialogColorPicker";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import useRoomTonerPreview from "@UserInterface/Hooks/Room/useRoomTonerPreview";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export type RoomFurnitureBackgroundTonerDialogData = {
    furniture: RoomInstanceFurniture;
    type: "furniture_background_color";
};

export default function RoomFurnitureBackgroundTonerDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const [enabled, setEnabled] = useState(data.data.data?.toner?.enabled ?? false);
    const [color, setColor] = useState(data.data.data?.toner?.color ?? "#000000");

    useRoomTonerPreview(enabled, color);

    const handleApply = useCallback(() => {       
        room?.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,
            data: {
                toner: {
                    enabled,
                    color
                }
            }
        }));
    }, [enabled, color, data, room]);
    
    const handleToggle = useCallback(() => {
        setEnabled(!enabled);

        room?.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,
            data: {
                toner: {
                    enabled: !enabled,
                    color
                }
            }
        }));
    }, [enabled, color, data, room]);

    if(hidden) {
        return null;
    }

    return (
        <Dialog title="Room Furniture Background" hidden={hidden} onClose={onClose} width={300} height={390} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,
                    
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                }}>
                    <DialogColorPicker value={color} onChange={setColor}/>
                </div>

                <div style={{
                    display: "flex",
                    gap: 10
                }}>
                    <DialogButton style={{ flex: 1 }} onClick={handleToggle}>{(enabled)?("Turn off"):("Turn on")}</DialogButton>
                    <DialogButton style={{ flex: 1 }} onClick={handleApply}>Apply</DialogButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
