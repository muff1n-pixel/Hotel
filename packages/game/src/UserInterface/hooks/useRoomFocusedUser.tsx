import { useEffect, useState } from "react";
import { clientInstance } from "../..";
import RoomInstance from "@Client/Room/RoomInstance";

export function useRoomFocusedUser(room?: RoomInstance) {
  const [focusedUser, setFocusedUser] = useState(room?.focusedUser.value);
  const [_state, setState] = useState(clientInstance.roomInstance.state);

  useEffect(() => {
    return room?.focusedUser.subscribe((focusedUser) => {
      setFocusedUser(focusedUser);
      setState(room.focusedUser.state);
    });
  }, [room]);

  return focusedUser;
}
