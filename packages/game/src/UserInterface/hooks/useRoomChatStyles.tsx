import { useEffect, useState } from "react";
import { clientInstance, webSocketClient } from "../..";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { RoomChatStylesEventData } from "@Shared/Communications/Responses/Rooms/Chat/Styles/RoomChatStylesEventData";

export function useRoomChatStyles() {
  const [room, setRoom] = useState(clientInstance.roomChatStyles.value);

  useEffect(() => {
    if(!clientInstance.roomChatStyles.value) {
      webSocketClient.send("GetRoomChatStylesEvent", null);
    }

    return clientInstance.roomChatStyles.subscribe(setRoom);
  }, []);

  return room;
}
