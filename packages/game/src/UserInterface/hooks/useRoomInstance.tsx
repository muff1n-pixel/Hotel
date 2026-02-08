import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useRoomInstance() {
  const [room, setRoom] = useState(clientInstance.roomInstance.value);
  const [_state, setState] = useState(clientInstance.roomInstance.state);

  useEffect(() => {
    return clientInstance.roomInstance.subscribe((room) => {
      setRoom(room);
      setState(clientInstance.roomInstance.state);
    });
  }, []);

  return room;
}
