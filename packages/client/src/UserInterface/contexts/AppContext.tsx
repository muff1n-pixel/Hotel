import { UserDataUpdated } from "@Shared/WebSocket/Events/User/UserDataUpdated";
import WebSocketClient from "../../WebSocket/WebSocketClient";
import { createContext, ReactElement } from "react";

export type Dialog = {
    id: string;
    data: unknown;
    type: string;
}

export type App = {
    user?: UserDataUpdated;

    dialogs: Dialog[];
    addUniqueDialog: (type: string) => void;
    closeDialog: (id: string) => void;
};

export const AppContext = createContext<App>({
    dialogs: [],
    addUniqueDialog: () => {},
    closeDialog: () => {},
});
