import { useCallback } from "react";
import Selection from "../../../Form/Selection";
import { useRoomInstance } from "../../../../hooks/useRoomInstance";
import { webSocketClient } from "../../../../..";
import Checkbox from "../../../Form/Checkbox";
import { UpdateRoomStructureData } from "@pixel63/events";

export default function RoomSettingsCustomizeTab() {
    const room = useRoomInstance();

    if(!room) {
        return;
    }

    const handleFloorThickness = useCallback((floorThickness: number) => {
        webSocketClient.sendProtobuff(UpdateRoomStructureData, UpdateRoomStructureData.create({
            floorThickness
        }));
    }, []);

    const handleWallThickness = useCallback((wallThickness: number) => {
        webSocketClient.sendProtobuff(UpdateRoomStructureData, UpdateRoomStructureData.create({
            wallThickness
        }));
    }, []);

    const handleWallHidden = useCallback((wallHidden: boolean) => {
        webSocketClient.sendProtobuff(UpdateRoomStructureData, UpdateRoomStructureData.create({
            wallHidden
        }));
    }, []);

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
                <b>Room customization</b>

                <p>Customize your walls and floors! You can choose whether or not the walls of your room are visible, and how thick the walls and floors are.</p>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 8
            }}>
                <b>Floor and walls</b>

                <Selection value={room.roomRenderer.structure.floor?.thickness} items={[
                    {
                        value: 0,
                        label: "Thinnest floor"
                    },
                    {
                        value: 4,
                        label: "Thin floor"
                    },
                    {
                        value: 8,
                        label: "Normal floor"
                    },
                    {
                        value: 12,
                        label: "Thick floor"
                    },
                    {
                        value: 16,
                        label: "Thickest floor"
                    }
                ]} onChange={(value) => handleFloorThickness(value as number)}/>
                
                <Selection value={room.roomRenderer.structure.wall?.thickness} items={[
                    {
                        value: 0,
                        label: "Thinnest walls"
                    },
                    {
                        value: 4,
                        label: "Thin walls"
                    },
                    {
                        value: 8,
                        label: "Normal walls"
                    },
                    {
                        value: 12,
                        label: "Thick walls"
                    },
                    {
                        value: 16,
                        label: "Thickest walls"
                    }
                ]} onChange={(value) => handleWallThickness(value as number)}/>

                <Checkbox label="Hide room walls" value={room.roomRenderer.structure.wall?.hidden ?? false} onChange={handleWallHidden}/>
            </div>
        </div>
    );
}
