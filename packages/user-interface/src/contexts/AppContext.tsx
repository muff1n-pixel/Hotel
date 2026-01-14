import { UserDataUpdated } from "@shared/WebSocket/Events/User/UserDataUpdated";
import WebSocketClient from "@shared/WebSocket/WebSocketClient";
import { createContext, ReactElement } from "react";

export type TypedEventTarget = EventTarget & {
    addEventListener<T>(type: string, callback: ((event: T) => void) | null, options?: AddEventListenerOptions | boolean): void;
    removeEventListener<T>(type: string, callback: ((event: T) => void) | null): void;
};

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

    webSocketClient: WebSocketClient;
    internalEventTarget: TypedEventTarget;
};

export const AppContext = createContext<App>({
    dialogs: [],
    addUniqueDialog: () => {},
    closeDialog: () => {},

    webSocketClient: null as any as WebSocketClient,
    internalEventTarget: null as any as TypedEventTarget
});
