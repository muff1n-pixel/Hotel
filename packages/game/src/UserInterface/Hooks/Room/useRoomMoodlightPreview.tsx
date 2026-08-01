import { useEffect } from "react";
import { useRoomInstance } from "../useRoomInstance";
import { UserFurnitureMoodlightData } from "@pixel63/events";

export default function useRoomMoodlightPreview(enabled: boolean, color: string, backgroundOnly: boolean) {
    const room = useRoomInstance();

    useEffect(() => {
        if(!room) {
            return;
        }

        if(!backgroundOnly) {
            room.roomRenderer.lighting.setPreviewMoodlightData(UserFurnitureMoodlightData.create({
                enabled,
                color,
                backgroundOnly
            }));

            return;
        }
        
        let timeout: NodeJS.Timeout | undefined = setTimeout(() => {
            timeout = undefined;

            room.roomRenderer.lighting.setPreviewMoodlightData(UserFurnitureMoodlightData.create({
                enabled,
                color,
                backgroundOnly
            }));
        }, 100);
  
        return () => {
            if(timeout !== undefined) {
                clearTimeout(timeout);
            }
        };
    }, [room, enabled, color, backgroundOnly]);

    useEffect(() => {
        if(!room) {
            return;
        }
  
        return () => {
            room.roomRenderer.lighting.setPreviewMoodlightData(undefined);
        };
    }, [room]);
}
