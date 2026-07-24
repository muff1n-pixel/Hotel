import { useCallback } from "react";
import { useRoomInstance } from "../../../Hooks/useRoomInstance";
import { webSocketClient } from "../../../..";
import { RoomPositionOffsetData, RoomStructureData, UpdateRoomStructureData } from "@pixel63/events";
import FloorPlanDialog from "@UserInterface/Components/Room/FloorPlan/FloorPlanDialog";

export type RoomFloorPlanDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomFloorPlanDialog({ hidden, onClose }: RoomFloorPlanDialogProps) {
    const room = useRoomInstance();

    const handleApply = useCallback((structure: RoomStructureData, offset: RoomPositionOffsetData) => {
        if(!room) {
            return;
        }

        webSocketClient.sendProtobuff(UpdateRoomStructureData, UpdateRoomStructureData.create({
            offset,
            grid: structure.grid,
            door: {
                row: structure.door?.row,
                column: structure.door?.column,
                direction: structure.door?.direction
            },

            wallThickness: structure.wall?.thickness,
            wallHidden: structure.wall?.hidden,
            wallHeight: structure.wall?.height,

            floorThickness: structure.floor?.thickness
        }))
    }, [room]);

    if(!room) {
        return null;
    }

    return (
        <FloorPlanDialog
            data={{
                structure: room.roomRenderer.structure.data,
                onSave: (structure, offset) => handleApply(structure, offset)
            }}
            hidden={hidden}
            onClose={onClose}
            />
    );
}
