import { createContext } from "react";

export const InternalEventTargetContext = createContext<EventTarget>(null as any as EventTarget);
