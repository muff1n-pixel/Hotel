import { useEffect } from "react";
import { useRoomInstance } from "../useRoomInstance";
import { UserFurnitureTonerData } from "@pixel63/events";

export default function useRoomTonerPreview(enabled: boolean, color: string) {
    const room = useRoomInstance();

    useEffect(() => {
        if(!room) {
            return;
        }

        room.roomRenderer.lighting.setPreviewTonerData(UserFurnitureTonerData.create({
            enabled,
            color,
        }));
    }, [room, enabled, color]);

    useEffect(() => {
        if(!room) {
            return;
        }
  
        return () => {
            room.roomRenderer.lighting.setPreviewTonerData(undefined);
        };
    }, [room]);
}
