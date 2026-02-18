import { useEffect, useState } from "react";
import { clientInstance } from "../..";
import RoomInstance from "@Client/Room/RoomInstance";

export function useRoomHoveredUser(room?: RoomInstance) {
  const [hoveredUser, setHoveredUser] = useState(room?.hoveredUser.value);
  const [_state, setState] = useState(clientInstance.roomInstance.state);

  useEffect(() => {
    return room?.hoveredUser.subscribe((hoveredUser) => {
      setHoveredUser(hoveredUser);
      setState(room.hoveredUser.state);
    });
  }, [room]);

  return hoveredUser;
}
