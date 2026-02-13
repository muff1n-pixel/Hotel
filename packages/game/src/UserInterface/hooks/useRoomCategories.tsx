import { useEffect, useState } from "react";
import { clientInstance, webSocketClient } from "../..";

export function useRoomCategories() {
  const [value, setValue] = useState(clientInstance.roomCategories.value);

  useEffect(() => {
    if(!clientInstance.roomCategories.value?.length) {
      webSocketClient.send("GetRoomCategoriesEvent", null);
    }

    return clientInstance.roomCategories.subscribe(setValue);
  }, []);

  return value;
}
