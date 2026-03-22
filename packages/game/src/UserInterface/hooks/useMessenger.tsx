import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useMessenger() {
  const [value, setValue] = useState(clientInstance.messenger.value!);
  const [_state, setState] = useState(clientInstance.messenger.state);

  useEffect(() => {
    return clientInstance.messenger.subscribe((value) => {
      setValue(value!);
      setState(clientInstance.messenger.state);
    });
  }, []);

  return value;
}
