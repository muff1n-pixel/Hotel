import { useEffect, useState } from "react";
import { clientInstance, webSocketClient } from "../..";
import { GetRoomChatStylesData } from "@pixel63/events";

export function useRoomChatStyles() {
  const [room, setRoom] = useState(clientInstance.roomChatStyles.value);

  useEffect(() => {
    if(!clientInstance.roomChatStyles.value) {
      webSocketClient.sendProtobuff(GetRoomChatStylesData, GetRoomChatStylesData.create({}));
    }

    return clientInstance.roomChatStyles.subscribe(setRoom);
  }, []);

  return room;
}
