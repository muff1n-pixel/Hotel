import { useCallback } from "react";
import Selection from "../../../../Common/Form/Components/Selection";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import { webSocketClient } from "../../../../..";
import Checkbox from "../../../../Common/Form/Components/Checkbox";
import { UpdateRoomStructureData } from "@pixel63/events";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useTranslation } from "react-i18next";

export default function RoomSettingsCustomizeTab() {
    const [getTranslation] = useTranslation("room");
    const room = useRoomInstance();
    const dialogs = useDialogs();

    if(!room) {
        return;
    }

    const handleFloorThickness = useCallback((floorThickness: number) => {
        room.websocket.sendProtobuff(UpdateRoomStructureData, UpdateRoomStructureData.create({
            floorThickness
        }));
    }, [room]);

    const handleWallThickness = useCallback((wallThickness: number) => {
        room.websocket.sendProtobuff(UpdateRoomStructureData, UpdateRoomStructureData.create({
            wallThickness
        }));
    }, [room]);

    const handleWallHidden = useCallback((wallHidden: boolean) => {
        room.websocket.sendProtobuff(UpdateRoomStructureData, UpdateRoomStructureData.create({
            wallHidden
        }));
    }, [room]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",
            gap: 32,
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 8
            }}>
                <b>{getTranslation("settings.customize.title")}</b>

                <p>{getTranslation("settings.customize.description")}</p>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 8
            }}>
                <b>{getTranslation("settings.customize.floor_walls")}</b>

                <Selection value={room.roomRenderer.structure.data.floor?.thickness} items={[
                    {
                        value: 0,
                        label: getTranslation("floorplan.thinnest_floor")
                    },
                    {
                        value: 4,
                        label: getTranslation("floorplan.thin_floor")
                    },
                    {
                        value: 8,
                        label: getTranslation("floorplan.normal_floor")
                    },
                    {
                        value: 12,
                        label: getTranslation("floorplan.thick_floor")
                    },
                    {
                        value: 16,
                        label: getTranslation("floorplan.thickest_floor")
                    }
                ]} onChange={(value) => handleFloorThickness(value as number)}/>
                
                <Selection value={room.roomRenderer.structure.data.wall?.thickness} items={[
                    {
                        value: 0,
                        label: getTranslation("floorplan.thinnest_walls")
                    },
                    {
                        value: 4,
                        label: getTranslation("floorplan.thin_walls")
                    },
                    {
                        value: 8,
                        label: getTranslation("floorplan.normal_walls")
                    },
                    {
                        value: 12,
                        label: getTranslation("floorplan.thick_walls")
                    },
                    {
                        value: 16,
                        label: getTranslation("floorplan.thickest_walls")
                    }
                ]} onChange={(value) => handleWallThickness(value as number)}/>

                <Checkbox label={getTranslation("floorplan.hide_walls")} value={room.roomRenderer.structure.data.wall?.hidden ?? false} onChange={handleWallHidden}/>
            </div>
            
            <DialogButton onClick={() => dialogs.addUniqueDialog("room-floorplan")}>{getTranslation("settings.customize.edit_floorplan")}</DialogButton>
        </div>
    );
}
