import { UserEventData } from "@Shared/Communications/Responses/User/UserEventData";
import { createContext, ReactElement } from "react";

export type Dialog = {
    id: string;
    data: unknown;
    type: string;
    hidden?: boolean;
}

export type App = {
    user?: UserEventData;
};

export const AppContext = createContext<App>({
});
