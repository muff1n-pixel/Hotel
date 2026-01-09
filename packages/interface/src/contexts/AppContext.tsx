import { createContext, ReactElement } from "react";

export type TypedEventTarget = EventTarget & {
    addEventListener<T>(type: string, callback: ((event: T) => void) | null, options?: AddEventListenerOptions | boolean): void;
    removeEventListener<T>(type: string, callback: ((event: T) => void) | null): void;
};

export type Dialog = {
    name: string;
    element: ReactElement;
}

export type App = {
    dialogs: Dialog[];
    addUniqueDialog: (dialog: Dialog) => void;

    internalEventTarget: TypedEventTarget;
};

export const AppContext = createContext<App>({
    dialogs: [],
    addUniqueDialog: () => {},
    internalEventTarget: new EventTarget() as TypedEventTarget
});
