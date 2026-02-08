import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useRoomHistory() {
  const [roomHistory, setRoomHistory] = useState(clientInstance.roomHistory.value);
  const [_state, setState] = useState(clientInstance.roomHistory.state);

  useEffect(() => {
    return clientInstance.roomHistory.subscribe((history) => {
      setRoomHistory(history);
      setState(clientInstance.roomHistory.state);
    });
  }, []);

  return roomHistory;
}
