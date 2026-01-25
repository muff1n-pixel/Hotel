import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useRoomInstance() {
  const [room, setRoom] = useState(clientInstance.roomInstance.value);

  useEffect(() => {
    return clientInstance.roomInstance.subscribe(setRoom);
  }, []);

  return room;
}
