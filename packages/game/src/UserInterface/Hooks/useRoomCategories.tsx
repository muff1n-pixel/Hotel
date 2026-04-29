import { useEffect, useState } from "react";
import { clientInstance, webSocketClient } from "../..";
import { GetRoomCategoriesData } from "@pixel63/events";

export function useRoomCategories() {
  const [value, setValue] = useState(clientInstance.roomCategories.value);

  useEffect(() => {
    if(!clientInstance.roomCategories.value?.length) {
      webSocketClient.sendProtobuff(GetRoomCategoriesData, GetRoomCategoriesData.create({}));
      
    }

    return clientInstance.roomCategories.subscribe(setValue);
  }, []);

  return value;
}
