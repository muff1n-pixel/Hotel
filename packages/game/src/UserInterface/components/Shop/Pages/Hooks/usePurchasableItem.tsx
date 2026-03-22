import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import { RoomPositionData } from "@pixel63/events";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useCallback, useEffect, useState } from "react";

export default function usePurchasableItem(purchaseItem: (stopPlacing: () => void, position: RoomPositionData | undefined, direction: number | undefined) => void) {
    const room = useRoomInstance();
    const dialogs = useDialogs();

    const [roomFurniturePlacer, setRoomFurniturePlacer] = useState<RoomFurniturePlacer>();
    
    useEffect(() => {
        if(!roomFurniturePlacer) {
            return;
        }

        if(!room?.hasRights) {
            return;
        }

        dialogs.setDialogHidden("shop", true);

        roomFurniturePlacer.startPlacing((position, direction) => {
            purchaseItem(stopPlacing, position, direction);
            
            dialogs.setDialogHidden("shop", false);
        }, () => {
            roomFurniturePlacer.destroy();

            setRoomFurniturePlacer(undefined);
            
            dialogs.setDialogHidden("shop", false);
        });
    }, [room, roomFurniturePlacer]);

    const startPlacing = useCallback((roomFurniturePlacer: RoomFurniturePlacer) => {
        setRoomFurniturePlacer(roomFurniturePlacer);
    }, []);

    const stopPlacing = useCallback(() => {
        if(roomFurniturePlacer) {
            roomFurniturePlacer.destroy();

            setRoomFurniturePlacer(undefined);
        }
    }, [ roomFurniturePlacer ]);

    return {
        placing: !!roomFurniturePlacer,
        startPlacing,
        stopPlacing
    };
}
