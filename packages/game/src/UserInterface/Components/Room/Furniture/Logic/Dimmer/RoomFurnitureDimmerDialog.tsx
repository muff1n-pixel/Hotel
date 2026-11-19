import { useCallback, useMemo, useState } from "react";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import { webSocketClient } from "../../../../../..";
import Dialog from "../../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../../../Common/Dialog/Components/Button/DialogButton";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import DialogHSLPicker from "@UserInterface/Common/Dialog/Components/ColorPicker/DialogHSLPicker";
import Colors from "@UserInterface/Utils/Colors";
import Checkbox from "@UserInterface/Common/Form/Components/Checkbox";
import useRoomMoodlightPreview from "@UserInterface/Hooks/Room/useRoomMoodlightPreview";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useTranslation } from "react-i18next";

export default function RoomFurnitureDimmerDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("room");
    const room = useRoomInstance();

    const [enabled, setEnabled] = useState(data.data.data?.moodlight?.enabled ?? false);
    const [backgroundOnly, setBackgroundOnly] = useState(data.data.data?.moodlight?.backgroundOnly ?? false);
    const [color, setColor] = useState(Colors.hexToHSL(data.data.data?.moodlight?.color ?? "#FF0000"));

    const hex = useMemo(() => Colors.hslToHex(color), [color]);

    useRoomMoodlightPreview(enabled, hex, backgroundOnly);

    const handleToggle = useCallback(() => {
        setEnabled(!enabled);

        room?.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                moodlight: {
                    enabled: !enabled,
                    color: Colors.hslToHex(color),
                    backgroundOnly
                }
            }
        }));
    }, [enabled, color, backgroundOnly, room]);

    const handleApply = useCallback(() => {
        room?.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                moodlight: {
                    enabled,
                    color: Colors.hslToHex(color),
                    backgroundOnly
                }
            }
        }));
    }, [enabled, color, backgroundOnly, room]);

    if(hidden) {
        return null;
    }

    return (
        <Dialog title={getTranslation("furniture.dimmer.title")} hidden={hidden} onClose={onClose} width={300} assumedHeight={350} height={"auto"} initialPosition="center">
            <DialogContent style={{
                gap: 10
            }}>
                <DialogHSLPicker value={color} onChange={setColor}/>

                <Checkbox value={backgroundOnly} onChange={setBackgroundOnly} label={getTranslation("furniture.dimmer.background_only")}/>

                <div style={{
                    display: "flex",
                    gap: 10
                }}>
                    <DialogButton style={{ flex: 1 }} onClick={handleToggle}>{(enabled)?(getTranslation("furniture.dimmer.turn_off")):(getTranslation("furniture.dimmer.turn_on"))}</DialogButton>
                    <DialogButton style={{ flex: 1 }} onClick={handleApply}>{getTranslation("furniture.dimmer.apply")}</DialogButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
