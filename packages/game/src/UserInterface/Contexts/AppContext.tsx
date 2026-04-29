import { createContext } from "react";

export type Dialog = {
    id: string;
    data: unknown;
    type: string;
    hidden?: boolean;
}

export type App = null;

export const AppContext = createContext<App>(null);
