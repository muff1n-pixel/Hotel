import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useUser() {
  const [user, setUser] = useState(clientInstance.user.value);
  const [_state, setState] = useState(clientInstance.user.state);

  useEffect(() => {
    return clientInstance.user.subscribe((user) => {
      setUser(user);
      setState(clientInstance.user.state);
    });
  }, []);

  return user!;
}
