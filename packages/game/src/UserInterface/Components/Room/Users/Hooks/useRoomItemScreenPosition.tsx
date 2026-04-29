import RoomItem from "@Client/Room/Items/RoomItem";
import { useEffect, useState } from "react";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";

export default function useRoomItemScreenPosition(item: RoomItem) {
    const room = useRoomInstance();

    const [position, setPosition] = useState(room?.roomRenderer.getItemScreenPosition(item));

    useEffect(() => {
        if(!room) {
            return;
        }

        const listener = () => {
            const position = room.roomRenderer.getItemScreenPosition(item);

            setPosition(position);
        };

        room.roomRenderer.addEventListener("render", listener);
  
        return () => {
            room.roomRenderer.removeEventListener("render", listener);
        };
    }, [room, item]);

    return position;
}
