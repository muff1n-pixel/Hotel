import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useMessengerUnread() {
  const [value, setValue] = useState(clientInstance.messengerUnread.value!);

  useEffect(() => {
    return clientInstance.messengerUnread.subscribe((value) => {
      setValue(value!);
    });
  }, []);

  return value;
}
